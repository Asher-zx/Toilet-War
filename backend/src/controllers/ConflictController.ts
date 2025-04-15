import { Request, Response } from 'express';
import { getRepository } from 'typeorm';
import { ConflictRecord } from '../models/ConflictRecord';

interface ConflictCheckRequest {
  role: 'husband' | 'wife';
  duration: number;
  complaints: number;
  sessionId: string;
}

export const checkConflict = async (req: Request, res: Response) => {
  const { role, duration, complaints } = req.body as ConflictCheckRequest;
  
  const thresholds = await getThresholds(role);
  
  let conflict = false;
  let conflictType: string | null = null;

  if (role === 'wife') {
    conflict = duration > thresholds.duration || complaints > thresholds.complaint;
    if (duration > thresholds.duration && complaints > thresholds.complaint) {
      conflictType = 'both';
    } else if (duration > thresholds.duration) {
      conflictType = 'duration';
    } else {
      conflictType = 'complaint';
    }
  } else {
    conflict = complaints > thresholds.complaint;
    conflictType = 'complaint';
  }

  const record = getRepository(ConflictRecord).create({
    role,
    duration,
    complaints,
    conflictType: conflict ? conflictType : null
  });

  await getRepository(ConflictRecord).save(record);

  res.json({
    conflict,
    conflictType,
    thresholds
  });
};

async function getThresholds(role: string) {
  return {
    duration: role === 'wife' ? 30 : 0,
    complaint: role === 'wife' ? 5 : 3
  };
}
