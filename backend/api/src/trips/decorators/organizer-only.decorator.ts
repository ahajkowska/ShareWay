import { SetMetadata } from '@nestjs/common';
import { ORGANIZER_ONLY_KEY } from '../guards/trip-access.guard.js';

export const OrganizerOnly = () => SetMetadata(ORGANIZER_ONLY_KEY, true);
