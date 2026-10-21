import { TrainerProfile } from '../models/trainer.model';

/** A minor's carnet number is never displayed anywhere in the UI — only an adult's DUI, and only once one is on file. */
export function getDuiValue(profile: TrainerProfile | null | undefined): string | null {
  return profile?.documentKind === 'dui' ? profile.documentValue : null;
}
