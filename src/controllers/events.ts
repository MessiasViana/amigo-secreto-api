import { RequestHandler } from "express";
import * as events from "../services/events";
import zod from 'zod';

export const getAll: RequestHandler = async (req, res) => {
  const items = await events.getAll();

  if (items) return res.json({ events: items });

  res.json({ error: 'Ocorreu um erro' });
}

export const getEvent: RequestHandler = async (req, res) => {
  const { id } = req.params;

  const item = await events.getOne(parseInt(id));

  if (item) return res.json({ event: item });

  res.json({ error: 'Ocorreu um erro' });
}

export const addEvent: RequestHandler = async (req, res) => {
  const addEventSchema = zod.object({
    title: zod.string(),
    description: zod.string(),
    grouped: zod.boolean()
  });

  const body = addEventSchema.safeParse(req.body);

  if (!body.success) return res.json({ error: 'Dados inválidos' });

  const newEvent = await events.add(body.data);

  if (newEvent) return res.status(201).json({ event: newEvent });

  res.json({ error: 'Ocorreu um erro' });
}

export const updateEvent: RequestHandler = async (req, res) => {
  const { id } = req.params;

  const updateEventSchema = zod.object({
    status: zod.boolean().optional(),
    title: zod.string().optional(),
    description: zod.string().optional(),
    grouped: zod.boolean().optional()
  });

  const body = updateEventSchema.safeParse(req.body);

  if (!body.success) return res.json({ error: 'Dados inválidos' });

  const updatedEvent = await events.update(parseInt(id), body.data);

  if (!updatedEvent) return res.json({ error: 'Ocorreu um erro' });
  
  if (updatedEvent.status) {
    // TODO: Fazer o sorteio
  } else { 
    // TODO: Limpar o sorteio
  }

  return res.status(201).json({ event: updatedEvent });

}

export const deleteEvent: RequestHandler = async (req, res) => { 
  const { id } = req.params;

  const deletedEvent = await events.remove(parseInt(id));

  if (deletedEvent) return res.json({ event: deletedEvent });
    
  res.json({ error: 'Ocorreu um erro' });
}

