A project with the mission to inform voters about the people they can actually vote for. A comprehensive, searchable list of all 6.457 candidates running for the Dutch Provincial Elections of 2023, as parsed and manually enhanced from the official [EML files](https://www.kiesraad.nl/verkiezingen/osv-en-eml/eml-standaard). 

[Visit site.](https://statenkandidaten.qntn.io)

## Features
- Fully searchable and filterable on name, gender, list position and place of residence;
- Every feature still works 100% when JavaScript is disabled, loading or unavailable;
- Dynamic and unique Open Graph images for each candidate to share on social media: [example](https://statenkandidaten.qntn.io/api/og/kandidaat/hedy-d-ancona.png) and [code](https://github.com/Coretteket/statenkandidaten/tree/main/src/routes/api/og);
- Current elected position manually verified for each candidate (whether provincial, parliamentary, or senate);
- Helpful links to election resources: party websites, media explainers and local election information.

## Technology
- Built with Svelte 4 and SvelteKit 2;
- Fully written in TypeScript;
- Typesafe ORM with Prisma;
- SQLite database hosted by [~~PlanetScale~~](https://planetscale.com/blog/planetscale-forever#:~:text=Our%20Hobby%20plan%20will%20be%20retired%20on%20April%208th%2C%202024.) Turso;
- Styled with TailwindCSS.
