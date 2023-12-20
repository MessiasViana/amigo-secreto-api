import { RequestHandler } from "express";
import * as people from "../services/people";
import zod from "zod";

export const getAll: RequestHandler = async (req, res) => { 
  const { id_event, id_group } = req.params;

  const items = await people.getAll({
    id_event: parseInt(id_event),
    id_group: parseInt(id_group)
  });

  if (items) return res.json({ people: items });

  res.json({ error: 'Ocorreu um erro' });
}

export const getPerson: RequestHandler = async (req, res) => { 
  const { id_event, id_group, id } = req.params;

  const item = await people.getOne({
    id_event: parseInt(id_event),
    id_group: parseInt(id_group),
    id: parseInt(id)
  });

  if (item) return res.json({ person: item });

  res.json({ error: 'Ocorreu um erro' });
}

export const addPerson: RequestHandler = async (req, res) => { 
  const { id_event, id_group } = req.params;

  const addPersonSchema = zod.object({
    name: zod.string(),
    cpf: zod.string().transform(value => value.replace(/\.|-/gm, '')),
  });

  const body = addPersonSchema.safeParse(req.body);

  if (!body.success) return res.json({ error: 'Dados inválidos' });

  const newPerson = await people.add({
    ...body.data,
    id_event: parseInt(id_event),
    id_group: parseInt(id_group),
  });

  if (newPerson) return res.json({ person: newPerson });

  res.json({ error: 'Ocorreu um erro' });
}

export const updatePerson: RequestHandler = async (req, res) => { 
  const { id_event, id_group, id } = req.params;

  const addPersonSchema = zod.object({
    name: zod.string().optional(),
    cpf: zod.string().transform(value => value.replace(/\.|-/gm, '')).optional(),
    matched: zod.string().optional(),
  });

  const body = addPersonSchema.safeParse(req.body);

  if (!body.success) return res.json({ error: 'Dados inválidos' });

  const updatedPerson = await people.update({
    id_event: parseInt(id_event),
    id_group: parseInt(id_group),
    id: parseInt(id),
  }, body.data);

  if (updatedPerson) {
    const item = await people.getOne({
      id: parseInt(id),
      id_event: parseInt(id_event),
    });

    return res.json({ person: item })
  }

  res.json({ error: 'Ocorreu um erro' });
}

export const deletePerson: RequestHandler = async (req, res) => { 
  const { id_event, id_group, id } = req.params;

  const deletedPerson = await people.remove({
    id: parseInt(id),
    id_event: parseInt(id_event),
    id_group: parseInt(id_group)
  });

  if (deletedPerson) return res.json({ person: deletedPerson });

  res.json({ error: 'Ocorreu um erro' });
}