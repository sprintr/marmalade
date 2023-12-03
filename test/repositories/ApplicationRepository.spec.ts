import ApplicationRepository from "../../src/repositories/ApplicationRepository";

import {
	Status,
} from "../../src/models/Application";

describe("ApplicationRepository", () => {
	let applicationRepository: ApplicationRepository;

	beforeAll(() => {
		applicationRepository = new ApplicationRepository();
	});

	describe("create", () => {
		it("should create an application", async () => {
			const application = await applicationRepository.create({
				name: "Example Application",
				homepage: "https://example.com",
				description: "An example application",
				clientId: "8bef98b4-9e74-48c9-955a-6495398ca2b6",
				clientSecret: "1474f0ebc8a8fb1c6db21346a20c74ceaf43c047839d3006f9a00412080fb5dc",
				clientCredentialsUpdatedAt: new Date(1700657308156),
				status: Status.Active,
			});

			const applicationFound = await applicationRepository.findById(application.id);
			expect(applicationFound?.name).toBe("Example Application");
			expect(applicationFound?.homepage).toBe("https://example.com");
			expect(applicationFound?.description).toBe("An example application");
			expect(applicationFound?.clientId).toBe("8bef98b4-9e74-48c9-955a-6495398ca2b6");
			expect(applicationFound?.clientSecret).toBe("1474f0ebc8a8fb1c6db21346a20c74ceaf43c047839d3006f9a00412080fb5dc");
			expect(applicationFound?.status).toBe(Status.Active);

			await applicationRepository.deleteById(application.id);
		});
	});

	describe("findById", () => {
		it("should find an application by its id", async () => {
			const application = await applicationRepository.create({
				name: "Example Application 2",
				homepage: "https://example.com",
				description: "Another example application",
				clientId: "8bef98b4-9e74-48c9-955a-6495398ca2b7",
				clientSecret: "1474f0ebc8a8fb1c6db21346a20c74ceaf43c047839d3006f9a00412080fb5dc",
				clientCredentialsUpdatedAt: new Date(1700657308156),
				status: Status.Active,
			});

			const applicationFound = await applicationRepository.findById(application.id);
			expect(applicationFound?.name).toBe("Example Application 2");
			expect(applicationFound?.homepage).toBe("https://example.com");
			expect(applicationFound?.description).toBe("Another example application");
			expect(applicationFound?.clientId).toBe("8bef98b4-9e74-48c9-955a-6495398ca2b7");
			expect(applicationFound?.clientSecret).toBe("1474f0ebc8a8fb1c6db21346a20c74ceaf43c047839d3006f9a00412080fb5dc");
			expect(applicationFound?.status).toBe(Status.Active);

			await applicationRepository.deleteById(application.id);
		});
	});

	describe("findByClientId", () => {
		it("should find an application by its client id", async () => {
			const application = await applicationRepository.create({
				name: "Example Application 3",
				homepage: "https://example.com",
				description: "Another example application",
				clientId: "8bef98b4-9e74-48c9-955a-6495398ca2b8",
				clientSecret: "1474f0ebc8a8fb1c6db21346a20c74ceaf43c047839d3006f9a00412080fb5dc",
				clientCredentialsUpdatedAt: new Date(1700657308156),
				status: Status.Active,
			});

			const applicationFound = await applicationRepository.findByClientId("8bef98b4-9e74-48c9-955a-6495398ca2b8");
			expect(applicationFound?.name).toBe("Example Application 3");
			expect(applicationFound?.homepage).toBe("https://example.com");
			expect(applicationFound?.description).toBe("Another example application");
			expect(applicationFound?.clientId).toBe("8bef98b4-9e74-48c9-955a-6495398ca2b8");
			expect(applicationFound?.clientSecret).toBe("1474f0ebc8a8fb1c6db21346a20c74ceaf43c047839d3006f9a00412080fb5dc");
			expect(applicationFound?.status).toBe(Status.Active);

			await applicationRepository.deleteById(application.id);
		});
	});

	describe("findAll", () => {
		it("should find all applications in descending order", async () => {
			const application1 = await applicationRepository.create({
				name: "Example Application 1",
				homepage: "https://example.com",
				description: "An example application",
				clientId: "8bef98b4-9e74-48c9-955a-6495398ca2c1",
				clientSecret: "1474f0ebc8a8fb1c6db21346a20c74ceaf43c047839d3006f9a00412080fb5d1",
				clientCredentialsUpdatedAt: new Date(1700657308156),
				status: Status.Active,
			}), application2 = await applicationRepository.create({
				name: "Example Application 2",
				homepage: "https://example.com",
				description: "An example application",
				clientId: "8bef98b4-9e74-48c9-955a-6495398ca2c2",
				clientSecret: "1474f0ebc8a8fb1c6db21346a20c74ceaf43c047839d3006f9a00412080fb5d2",
				clientCredentialsUpdatedAt: new Date(1700657308156),
				status: Status.Active,
			}), application3 = await applicationRepository.create({
				name: "Example Application 3",
				homepage: "https://example.com",
				description: "An example application",
				clientId: "8bef98b4-9e74-48c9-955a-6495398ca2c3",
				clientSecret: "1474f0ebc8a8fb1c6db21346a20c74ceaf43c047839d3006f9a00412080fb5d3",
				clientCredentialsUpdatedAt: new Date(1700657308156),
				status: Status.Active,
			}), application4 = await applicationRepository.create({
				name: "Example Application 4",
				homepage: "https://example.com",
				description: "An example application",
				clientId: "8bef98b4-9e74-48c9-955a-6495398ca2c4",
				clientSecret: "1474f0ebc8a8fb1c6db21346a20c74ceaf43c047839d3006f9a00412080fb5d4",
				clientCredentialsUpdatedAt: new Date(1700657308156),
				status: Status.Active,
			});

			const applications = await applicationRepository.findAll('desc', 0, 4);
			expect(applications.length).toBe(4);

			expect(applications[0]?.name).toBe("Example Application 4");
			expect(applications[0]?.homepage).toBe("https://example.com");
			expect(applications[0]?.description).toBe("An example application");
			expect(applications[0]?.clientId).toBe("8bef98b4-9e74-48c9-955a-6495398ca2c4");
			expect(applications[0]?.clientSecret).toBe("1474f0ebc8a8fb1c6db21346a20c74ceaf43c047839d3006f9a00412080fb5d4");
			expect(applications[0]?.status).toBe(Status.Active);

			expect(applications[1]?.name).toBe("Example Application 3");
			expect(applications[1]?.homepage).toBe("https://example.com");
			expect(applications[1]?.description).toBe("An example application");
			expect(applications[1]?.clientId).toBe("8bef98b4-9e74-48c9-955a-6495398ca2c3");
			expect(applications[1]?.clientSecret).toBe("1474f0ebc8a8fb1c6db21346a20c74ceaf43c047839d3006f9a00412080fb5d3");
			expect(applications[1]?.status).toBe(Status.Active);

			expect(applications[2]?.name).toBe("Example Application 2");
			expect(applications[2]?.homepage).toBe("https://example.com");
			expect(applications[2]?.description).toBe("An example application");
			expect(applications[2]?.clientId).toBe("8bef98b4-9e74-48c9-955a-6495398ca2c2");
			expect(applications[2]?.clientSecret).toBe("1474f0ebc8a8fb1c6db21346a20c74ceaf43c047839d3006f9a00412080fb5d2");
			expect(applications[2]?.status).toBe(Status.Active);

			expect(applications[3]?.name).toBe("Example Application 1");
			expect(applications[3]?.homepage).toBe("https://example.com");
			expect(applications[3]?.description).toBe("An example application");
			expect(applications[3]?.clientId).toBe("8bef98b4-9e74-48c9-955a-6495398ca2c1");
			expect(applications[3]?.clientSecret).toBe("1474f0ebc8a8fb1c6db21346a20c74ceaf43c047839d3006f9a00412080fb5d1");
			expect(applications[3]?.status).toBe(Status.Active);

			await applicationRepository.deleteById(application1.id);
			await applicationRepository.deleteById(application2.id);
			await applicationRepository.deleteById(application3.id);
			await applicationRepository.deleteById(application4.id);
		});

		it("should find all applications in descending order with pagination", async () => {
			const application1 = await applicationRepository.create({
				name: "Example Application 1",
				homepage: "https://example.com",
				description: "An example application",
				clientId: "8bef98b4-9e74-48c9-955a-6495398ca2c1",
				clientSecret: "1474f0ebc8a8fb1c6db21346a20c74ceaf43c047839d3006f9a00412080fb5d1",
				clientCredentialsUpdatedAt: new Date(1700657308156),
				status: Status.Active,
			}), application2 = await applicationRepository.create({
				name: "Example Application 2",
				homepage: "https://example.com",
				description: "An example application",
				clientId: "8bef98b4-9e74-48c9-955a-6495398ca2c2",
				clientSecret: "1474f0ebc8a8fb1c6db21346a20c74ceaf43c047839d3006f9a00412080fb5d2",
				clientCredentialsUpdatedAt: new Date(1700657308156),
				status: Status.Active,
			}), application3 = await applicationRepository.create({
				name: "Example Application 3",
				homepage: "https://example.com",
				description: "An example application",
				clientId: "8bef98b4-9e74-48c9-955a-6495398ca2c3",
				clientSecret: "1474f0ebc8a8fb1c6db21346a20c74ceaf43c047839d3006f9a00412080fb5d3",
				clientCredentialsUpdatedAt: new Date(1700657308156),
				status: Status.Active,
			}), application4 = await applicationRepository.create({
				name: "Example Application 4",
				homepage: "https://example.com",
				description: "An example application",
				clientId: "8bef98b4-9e74-48c9-955a-6495398ca2c4",
				clientSecret: "1474f0ebc8a8fb1c6db21346a20c74ceaf43c047839d3006f9a00412080fb5d4",
				clientCredentialsUpdatedAt: new Date(1700657308156),
				status: Status.Active,
			});

			const applications = await applicationRepository.findAll('desc', 0, 2);
			expect(applications.length).toBe(2);

			expect(applications[0]?.name).toBe("Example Application 4");
			expect(applications[0]?.homepage).toBe("https://example.com");
			expect(applications[0]?.description).toBe("An example application");
			expect(applications[0]?.clientId).toBe("8bef98b4-9e74-48c9-955a-6495398ca2c4");
			expect(applications[0]?.clientSecret).toBe("1474f0ebc8a8fb1c6db21346a20c74ceaf43c047839d3006f9a00412080fb5d4");
			expect(applications[0]?.status).toBe(Status.Active);

			expect(applications[1]?.name).toBe("Example Application 3");
			expect(applications[1]?.homepage).toBe("https://example.com");
			expect(applications[1]?.description).toBe("An example application");
			expect(applications[1]?.clientId).toBe("8bef98b4-9e74-48c9-955a-6495398ca2c3");
			expect(applications[1]?.clientSecret).toBe("1474f0ebc8a8fb1c6db21346a20c74ceaf43c047839d3006f9a00412080fb5d3");
			expect(applications[1]?.status).toBe(Status.Active);

			await applicationRepository.deleteById(application1.id);
			await applicationRepository.deleteById(application2.id);
			await applicationRepository.deleteById(application3.id);
			await applicationRepository.deleteById(application4.id);
		});

		it("should find all applications in ascending order", async () => {
			const application1 = await applicationRepository.create({
				name: "Example Application 1",
				homepage: "https://example.com",
				description: "An example application",
				clientId: "8bef98b4-9e74-48c9-955a-6495398ca2c1",
				clientSecret: "1474f0ebc8a8fb1c6db21346a20c74ceaf43c047839d3006f9a00412080fb5d1",
				clientCredentialsUpdatedAt: new Date(1700657308156),
				status: Status.Active,
			}), application2 = await applicationRepository.create({
				name: "Example Application 2",
				homepage: "https://example.com",
				description: "An example application",
				clientId: "8bef98b4-9e74-48c9-955a-6495398ca2c2",
				clientSecret: "1474f0ebc8a8fb1c6db21346a20c74ceaf43c047839d3006f9a00412080fb5d2",
				clientCredentialsUpdatedAt: new Date(1700657308156),
				status: Status.Active,
			}), application3 = await applicationRepository.create({
				name: "Example Application 3",
				homepage: "https://example.com",
				description: "An example application",
				clientId: "8bef98b4-9e74-48c9-955a-6495398ca2c3",
				clientSecret: "1474f0ebc8a8fb1c6db21346a20c74ceaf43c047839d3006f9a00412080fb5d3",
				clientCredentialsUpdatedAt: new Date(1700657308156),
				status: Status.Active,
			}), application4 = await applicationRepository.create({
				name: "Example Application 4",
				homepage: "https://example.com",
				description: "An example application",
				clientId: "8bef98b4-9e74-48c9-955a-6495398ca2c4",
				clientSecret: "1474f0ebc8a8fb1c6db21346a20c74ceaf43c047839d3006f9a00412080fb5d4",
				clientCredentialsUpdatedAt: new Date(1700657308156),
				status: Status.Active,
			});

			const applications = await applicationRepository.findAll('asc', 0, 4);
			expect(applications.length).toBe(4);

			expect(applications[0]?.name).toBe("Example Application 1");
			expect(applications[0]?.homepage).toBe("https://example.com");
			expect(applications[0]?.description).toBe("An example application");
			expect(applications[0]?.clientId).toBe("8bef98b4-9e74-48c9-955a-6495398ca2c1");
			expect(applications[0]?.clientSecret).toBe("1474f0ebc8a8fb1c6db21346a20c74ceaf43c047839d3006f9a00412080fb5d1");
			expect(applications[0]?.status).toBe(Status.Active);

			expect(applications[1]?.name).toBe("Example Application 2");
			expect(applications[1]?.homepage).toBe("https://example.com");
			expect(applications[1]?.description).toBe("An example application");
			expect(applications[1]?.clientId).toBe("8bef98b4-9e74-48c9-955a-6495398ca2c2");
			expect(applications[1]?.clientSecret).toBe("1474f0ebc8a8fb1c6db21346a20c74ceaf43c047839d3006f9a00412080fb5d2");
			expect(applications[1]?.status).toBe(Status.Active);

			expect(applications[2]?.name).toBe("Example Application 3");
			expect(applications[2]?.homepage).toBe("https://example.com");
			expect(applications[2]?.description).toBe("An example application");
			expect(applications[2]?.clientId).toBe("8bef98b4-9e74-48c9-955a-6495398ca2c3");
			expect(applications[2]?.clientSecret).toBe("1474f0ebc8a8fb1c6db21346a20c74ceaf43c047839d3006f9a00412080fb5d3");
			expect(applications[2]?.status).toBe(Status.Active);

			expect(applications[3]?.name).toBe("Example Application 4");
			expect(applications[3]?.homepage).toBe("https://example.com");
			expect(applications[3]?.description).toBe("An example application");
			expect(applications[3]?.clientId).toBe("8bef98b4-9e74-48c9-955a-6495398ca2c4");
			expect(applications[3]?.clientSecret).toBe("1474f0ebc8a8fb1c6db21346a20c74ceaf43c047839d3006f9a00412080fb5d4");
			expect(applications[3]?.status).toBe(Status.Active);

			await applicationRepository.deleteById(application1.id);
			await applicationRepository.deleteById(application2.id);
			await applicationRepository.deleteById(application3.id);
			await applicationRepository.deleteById(application4.id);
		});

		it("should find all applications in ascending order with pagination", async () => {
			const application1 = await applicationRepository.create({
				name: "Example Application 1",
				homepage: "https://example.com",
				description: "An example application",
				clientId: "8bef98b4-9e74-48c9-955a-6495398ca2c1",
				clientSecret: "1474f0ebc8a8fb1c6db21346a20c74ceaf43c047839d3006f9a00412080fb5d1",
				clientCredentialsUpdatedAt: new Date(1700657308156),
				status: Status.Active,
			}), application2 = await applicationRepository.create({
				name: "Example Application 2",
				homepage: "https://example.com",
				description: "An example application",
				clientId: "8bef98b4-9e74-48c9-955a-6495398ca2c2",
				clientSecret: "1474f0ebc8a8fb1c6db21346a20c74ceaf43c047839d3006f9a00412080fb5d2",
				clientCredentialsUpdatedAt: new Date(1700657308156),
				status: Status.Active,
			}), application3 = await applicationRepository.create({
				name: "Example Application 3",
				homepage: "https://example.com",
				description: "An example application",
				clientId: "8bef98b4-9e74-48c9-955a-6495398ca2c3",
				clientSecret: "1474f0ebc8a8fb1c6db21346a20c74ceaf43c047839d3006f9a00412080fb5d3",
				clientCredentialsUpdatedAt: new Date(1700657308156),
				status: Status.Active,
			}), application4 = await applicationRepository.create({
				name: "Example Application 4",
				homepage: "https://example.com",
				description: "An example application",
				clientId: "8bef98b4-9e74-48c9-955a-6495398ca2c4",
				clientSecret: "1474f0ebc8a8fb1c6db21346a20c74ceaf43c047839d3006f9a00412080fb5d4",
				clientCredentialsUpdatedAt: new Date(1700657308156),
				status: Status.Active,
			});

			const applications = await applicationRepository.findAll('asc', 0, 2);
			expect(applications.length).toBe(2);

			expect(applications[0]?.name).toBe("Example Application 1");
			expect(applications[0]?.homepage).toBe("https://example.com");
			expect(applications[0]?.description).toBe("An example application");
			expect(applications[0]?.clientId).toBe("8bef98b4-9e74-48c9-955a-6495398ca2c1");
			expect(applications[0]?.clientSecret).toBe("1474f0ebc8a8fb1c6db21346a20c74ceaf43c047839d3006f9a00412080fb5d1");
			expect(applications[0]?.status).toBe(Status.Active);

			expect(applications[1]?.name).toBe("Example Application 2");
			expect(applications[1]?.homepage).toBe("https://example.com");
			expect(applications[1]?.description).toBe("An example application");
			expect(applications[1]?.clientId).toBe("8bef98b4-9e74-48c9-955a-6495398ca2c2");
			expect(applications[1]?.clientSecret).toBe("1474f0ebc8a8fb1c6db21346a20c74ceaf43c047839d3006f9a00412080fb5d2");
			expect(applications[1]?.status).toBe(Status.Active);

			await applicationRepository.deleteById(application1.id);
			await applicationRepository.deleteById(application2.id);
			await applicationRepository.deleteById(application3.id);
			await applicationRepository.deleteById(application4.id);
		});
	});

	describe("updateCredentialsById", () => {
		it("should update credentials", async () => {
			const application = await applicationRepository.create({
				name: "Example Application",
				homepage: "https://example.com",
				description: "An example application",
				clientId: "8bef98b4-9e74-48c9-955a-6495398ca2b6",
				clientSecret: "1474f0ebc8a8fb1c6db21346a20c74ceaf43c047839d3006f9a00412080fb5dc",
				clientCredentialsUpdatedAt: new Date(1700657308156),
				status: Status.Active,
			});

			await applicationRepository.updateCredentialsById(application.id, {
				clientId: "8bef98b4-9e74-48c9-955a-6495398ca2b8",
				clientSecret: "1474f0ebc8a8fb1c6db21346a20c74ceaf43c047839d3006f9a00412080fb5bc",
				clientCredentialsUpdatedAt: new Date(1700657308156),
			});

			const applicationFound = await applicationRepository.findById(application.id);
			expect(applicationFound?.name).toBe("Example Application");
			expect(applicationFound?.homepage).toBe("https://example.com");
			expect(applicationFound?.description).toBe("An example application");
			expect(applicationFound?.clientId).toBe("8bef98b4-9e74-48c9-955a-6495398ca2b8");
			expect(applicationFound?.clientSecret).toBe("1474f0ebc8a8fb1c6db21346a20c74ceaf43c047839d3006f9a00412080fb5bc");
			expect(applicationFound?.status).toBe(Status.Active);

			await applicationRepository.deleteById(application.id);
		});
	});

	describe("updateStatusById", () => {
		it("should update status", async () => {
			const application = await applicationRepository.create({
				name: "Example Application",
				homepage: "https://example.com",
				description: "An example application",
				clientId: "8bef98b4-9e74-48c9-955a-6495398ca2b6",
				clientSecret: "1474f0ebc8a8fb1c6db21346a20c74ceaf43c047839d3006f9a00412080fb5dc",
				clientCredentialsUpdatedAt: new Date(1700657308156),
				status: Status.Active,
			});

			await applicationRepository.updateStatusById(application.id, {
				status: Status.Inactive,
			});

			const applicationFound = await applicationRepository.findById(application.id);
			expect(applicationFound?.name).toBe("Example Application");
			expect(applicationFound?.homepage).toBe("https://example.com");
			expect(applicationFound?.description).toBe("An example application");
			expect(applicationFound?.clientId).toBe("8bef98b4-9e74-48c9-955a-6495398ca2b6");
			expect(applicationFound?.clientSecret).toBe("1474f0ebc8a8fb1c6db21346a20c74ceaf43c047839d3006f9a00412080fb5dc");
			expect(applicationFound?.status).toBe(Status.Inactive);

			await applicationRepository.deleteById(application.id);
		});
	});

	describe("deleteById", () => {
		it("should delete an application", async () => {
			const application = await applicationRepository.create({
				name: "Example Application",
				homepage: "https://example.com",
				description: "An example application",
				clientId: "8bef98b4-9e74-48c9-955a-6495398ca2b6",
				clientSecret: "1474f0ebc8a8fb1c6db21346a20c74ceaf43c047839d3006f9a00412080fb5dc",
				clientCredentialsUpdatedAt: new Date(1700657308156),
				status: Status.Active,
			});

			await applicationRepository.deleteById(application.id);

			const applicationFound = await applicationRepository.findById(application.id);
			expect(applicationFound).toBe(null);
		});
	});
});
