import { Router } from 'express';
import type { Model } from 'mongoose';

interface ResourceRouterOptions {
  populate?: string;
  writableFields: readonly string[];
}

class RequestBodyError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'RequestBodyError';
  }
}

function getWritableBody(
  body: unknown,
  writableFields: readonly string[],
): Record<string, unknown> {
  if (body === null || typeof body !== 'object' || Array.isArray(body)) {
    throw new RequestBodyError('Request body must be a JSON object');
  }

  const unsupportedFields = Object.keys(body).filter(
    (field) => !writableFields.includes(field),
  );
  if (unsupportedFields.length > 0) {
    throw new RequestBodyError(
      `Unsupported field(s): ${unsupportedFields.join(', ')}`,
    );
  }

  return Object.fromEntries(Object.entries(body));
}

export function createResourceRouter<T>(
  resourceModel: Model<T>,
  { populate, writableFields }: ResourceRouterOptions,
): Router {
  const router = Router();

  router.get('/', async (_request, response) => {
    const query = resourceModel.find().sort({ createdAt: -1 });
    if (populate) query.populate(populate);
    response.json(await query.exec());
  });

  router.post('/', async (request, response) => {
    const body = getWritableBody(request.body, writableFields);
    response.status(201).json(await resourceModel.create(body as Partial<T>));
  });

  router.get('/:id', async (request, response) => {
    const query = resourceModel.findById(request.params.id);
    if (populate) query.populate(populate);
    const record = await query.exec();
    if (!record) {
      response.status(404).json({ error: 'Record not found' });
      return;
    }
    response.json(record);
  });

  router.patch('/:id', async (request, response) => {
    const body = getWritableBody(request.body, writableFields);
    const record = await resourceModel
      .findByIdAndUpdate(request.params.id, body, {
        new: true,
        runValidators: true,
      })
      .exec();
    if (!record) {
      response.status(404).json({ error: 'Record not found' });
      return;
    }
    response.json(record);
  });

  router.delete('/:id', async (request, response) => {
    const record = await resourceModel.findByIdAndDelete(request.params.id).exec();
    if (!record) {
      response.status(404).json({ error: 'Record not found' });
      return;
    }
    response.status(204).end();
  });

  return router;
}
