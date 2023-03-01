import type { Candidate, Gender } from '@prisma/client';
import { switcher } from './utils';

export const genderOptions = [
	{ id: 'man', name: 'Man' },
	{ id: 'vrouw', name: 'Vrouw' },
	{ id: 'onbekend', name: 'Onbekend' },
];

export const roleOptions = [
	{ id: 'statenlid', name: 'Statenlid' },
	{ id: 'gedeputeerde', name: 'Gedeputeerde' },
	{ id: 'kamerlid', name: 'Tweede Kamerlid' },
	{ id: 'senator', name: 'Eerste Kamerlid' },
	{ id: 'geen', name: 'Geen functie bekend' },
];

export const getGender = (gender: Gender | null) =>
	switcher(gender, {
		MALE: 'Man',
		FEMALE: 'Vrouw',
		OTHER: 'Anders',
		default: 'Onbekend',
	});

type PartialCandidate = Pick<Candidate, 'firstname' | 'initials' | 'prefix' | 'surname'>;
export const getFullName = ({ firstname, initials, prefix, surname }: PartialCandidate) =>
	[firstname ?? initials, prefix, surname!.replace(/ - /g, '-')].filter(Boolean).join(' ');

export const getOfficialName = ({ firstname, initials, prefix, surname }: PartialCandidate) =>
	`${[prefix, surname].filter(Boolean).join(' ')}, ${initials}` +
	(firstname ? ` (${firstname})` : '');

export const getListName = (
	candidateList: { id: string; alias: string | null },
	parties: { name: string; alias: string | null; lists: { id: string }[] }[],
) => {
	const listAlias = candidateList.alias;
	if (listAlias) return listAlias;
	return parties
		.filter((p) => p.lists.some((l) => l.id === candidateList.id))
		.map((p) => p.alias ?? p.name)
		.join('-');
};

export const getPosition = (
	candidateLists: { constituency?: string; position: number }[],
	selectedConstituency?: string,
) => {
	const list = selectedConstituency
		? candidateLists.find((l) => l.constituency === selectedConstituency) ?? candidateLists[0]
		: candidateLists[0];
	return list.position;
};

export const formatPosition = (
	candidateLists: { constituency?: string; position: number }[],
	selectedConstituency?: string,
) => {
	const nf = new Intl.NumberFormat('nl', { minimumIntegerDigits: 2 });
	const position = getPosition(candidateLists, selectedConstituency);
	return nf.format(position);
};

export const slugify = (locality: string | null | undefined) =>
	(locality ?? '')
		.replace(/[ ]/g, '-')
		.replace("'s-", '')
		.replace(/['"\(\)]/g, '')
		.toLocaleLowerCase('nl');
