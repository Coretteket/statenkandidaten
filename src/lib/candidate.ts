import type { Candidate, Gender } from '@prisma/client';
import { switcher } from './utils';

export const getGender = (gender: Gender | null) =>
	switcher(gender, {
		MALE: 'Man',
		FEMALE: 'Vrouw',
		OTHER: 'Anders',
		default: 'Onbekend',
	});

type PartialCandidate = Pick<Candidate, 'firstname' | 'initials' | 'prefix' | 'surname'>;
export const getFullName = ({ firstname, initials, prefix, surname }: PartialCandidate) =>
	[firstname ?? initials, prefix, surname.replace(/ - /g, '-')].filter(Boolean).join(' ');

export const getOfficialName = ({ firstname, initials, prefix, surname }: PartialCandidate) =>
	`${[prefix, surname].filter(Boolean).join(' ')}, ${initials}` +
	(firstname ? ` (${firstname})` : '');

export const slugify = (locality: string | null | undefined) =>
	(locality ?? '')
		.replace(/[ ]/g, '-')
		.replace("'s-", '')
		.replace(/['"\(\)]/g, '')
		.toLocaleLowerCase('nl');
