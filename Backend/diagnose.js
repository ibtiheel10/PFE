const { DataSource } = require("typeorm");

const PostgresDriver = require("pg");

const dataSource = new DataSource({
  type: "postgres",
  host: "127.0.0.1",
  port: 5432,
  username: "postgres",
  password: "123456",
  database: "skillvia_db_2",
  entities: [__dirname + "/src/**/*.entity.ts"],
});

async function run() {
  await dataSource.initialize();
  const offreRepo = dataSource.getRepository("OffreEmploi");
  const candidatureRepo = dataSource.getRepository("Candidature");

  // Get all active offers
  const offers = await offreRepo.find();
  console.log("Total offers:", offers.length);
  for (const o of offers) {
    console.log(`Offer ${o.id}: '${o.TitreDePost}', Competences: '${o.competences}', Limit: ${o.DateLimite}`);
  }

  // Get all candidatures
  const candidatures = await candidatureRepo.find({ relations: ["candidat", "offre"] });
  console.log("\nTotal candidatures:", candidatures.length);
  for (const c of candidatures) {
      console.log(`Candidature ${c.id}: User ${c.candidat?.id} on Offer ${c.offre?.id}`);
      if (c.evaluationDetails) {
          const eval = JSON.parse(c.evaluationDetails);
          console.log(`  -> Skills:`, JSON.stringify(eval.ScoreParCompetence || eval.skillsAnalysis));
      }
  }

  process.exit();
}
run().catch(console.error);
