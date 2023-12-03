import { Status } from "../../src/models/Application";

import ApplicationRepository from "../../src/repositories/ApplicationRepository";

import ApplicationService from "../../src/services/ApplicationService";

describe("ApplicationService", () => {
	let applicationRepository: ApplicationRepository;

	let applicationService: ApplicationService;

	beforeAll(() => {
		applicationRepository = new ApplicationRepository();
		applicationService = new ApplicationService(applicationRepository);
	});

	describe("createApplication", () => {
		it("should create an application", async () => {
			const application = await applicationService.createApplication({
				name: "Columbidae",
				homepage: "https://columbidae.example.com",
				description: "This is an example application",
			});

			expect(application?.name).toBe("Columbidae");
			expect(application?.homepage).toBe("https://columbidae.example.com");
			expect(application?.description).toBe("This is an example application");
			expect(application?.clientId?.length).toBe(36);
			expect(application?.clientSecret?.length).toBe(64);
			expect(application?.status).toBe(Status.Active);

			await applicationRepository.deleteById(application.id);
		});
	});

	describe("getApplication", () => {
		it("should get an application", async () => {
			const application = await applicationService.createApplication({
				name: "Columbidae",
				homepage: "https://columbidae.example.com",
				description: "This is an example application",
			});

			const applicationFound = await applicationService.getApplication(application.id);
			expect(applicationFound?.name).toBe("Columbidae");
			expect(applicationFound?.homepage).toBe("https://columbidae.example.com");
			expect(applicationFound?.description).toBe("This is an example application");
			expect(applicationFound?.clientId?.length).toBe(36);
			expect(applicationFound?.clientSecret?.length).toBe(64);
			expect(applicationFound?.status).toBe(Status.Active);

			await applicationRepository.deleteById(application.id);
		});
	});

	describe("getApplicationByClientId", () => {
		it("should get an application by client id", async () => {
			const application = await applicationService.createApplication({
				name: "Columbidae",
				homepage: "https://columbidae.example.com",
				description: "This is an example application",
			});

			const applicationFound = await applicationService.getApplicationByClientId(application.clientId);
			expect(applicationFound?.name).toBe("Columbidae");
			expect(applicationFound?.homepage).toBe("https://columbidae.example.com");
			expect(applicationFound?.description).toBe("This is an example application");
			expect(applicationFound?.clientId?.length).toBe(36);
			expect(applicationFound?.clientSecret?.length).toBe(64);
			expect(applicationFound?.status).toBe(Status.Active);

			await applicationRepository.deleteById(application.id);
		});
	});

	describe("getAllApplications", () => {
		it("should get an application by client id", async () => {
			const application1 = await applicationService.createApplication({
				name: "Orders Application",
				homepage: "https://orders.example.com",
				description: "This is the orders application",
			}), application2 = await applicationService.createApplication({
				name: "Payments Application",
				homepage: "https://payments.example.com",
				description: "This is the payments application",
			}), application3 = await applicationService.createApplication({
				name: "Subscriptions Application",
				homepage: "https://subscriptions.example.com",
				description: "This is the subscriptions application",
			}), application4 = await applicationService.createApplication({
				name: "Tracking Application",
				homepage: "https://tracking.example.com",
				description: "This is the tracking application",
			});

			const applicationsFound = await applicationService.getAllApplications({}, "desc", 1, 30);
			expect(applicationsFound.length).toBe(4);

			expect(applicationsFound[0]?.name).toBe("Tracking Application");
			expect(applicationsFound[0]?.homepage).toBe("https://tracking.example.com");
			expect(applicationsFound[0]?.description).toBe("This is the tracking application");
			expect(applicationsFound[0]?.status).toBe(Status.Active);

			expect(applicationsFound[1]?.name).toBe("Subscriptions Application");
			expect(applicationsFound[1]?.homepage).toBe("https://subscriptions.example.com");
			expect(applicationsFound[1]?.description).toBe("This is the subscriptions application");
			expect(applicationsFound[1]?.status).toBe(Status.Active);

			expect(applicationsFound[2]?.name).toBe("Payments Application");
			expect(applicationsFound[2]?.homepage).toBe("https://payments.example.com");
			expect(applicationsFound[2]?.description).toBe("This is the payments application");
			expect(applicationsFound[2]?.status).toBe(Status.Active);

			expect(applicationsFound[3]?.name).toBe("Orders Application");
			expect(applicationsFound[3]?.homepage).toBe("https://orders.example.com");
			expect(applicationsFound[3]?.description).toBe("This is the orders application");
			expect(applicationsFound[3]?.status).toBe(Status.Active);

			await applicationRepository.deleteById(application1.id);
			await applicationRepository.deleteById(application2.id);
			await applicationRepository.deleteById(application3.id);
			await applicationRepository.deleteById(application4.id);
		});
	});

	describe("updateApplication", () => {
		it("should update the application", async () => {
			const application = await applicationService.createApplication({
				name: "Orders Application",
				homepage: "https://orders.example.com",
				description: "This is the orders application",
			});

			await applicationService.updateApplication(application.id, {
				name: "Payments Application",
				homepage: "https://payments.example.com",
				description: "This is the payments application",
			});

			const applicationFound = await applicationService.getApplication(application.id);
			expect(applicationFound?.name).toBe("Payments Application");
			expect(applicationFound?.homepage).toBe("https://payments.example.com");
			expect(applicationFound?.description).toBe("This is the payments application");
			expect(applicationFound?.status).toBe(Status.Active);

			await applicationRepository.deleteById(application.id);
		});
	});

	describe("updateApplicationCredentials", () => {
		it("should update the credentials of an application", async () => {
			const application = await applicationService.createApplication({
				name: "Orders Application",
				homepage: "https://orders.example.com",
				description: "This is the orders application",
			});

			await applicationService.updateApplicationCredentials(application.id);

			const applicationFound = await applicationService.getApplication(application.id);
			expect(applicationFound?.name).toBe("Orders Application");
			expect(applicationFound?.homepage).toBe("https://orders.example.com");
			expect(applicationFound?.description).toBe("This is the orders application");
			expect(applicationFound?.clientId !== application.clientId).toBe(true);
			expect(applicationFound?.clientId?.length).toBe(36);
			expect(applicationFound?.clientSecret !== application.clientSecret).toBe(true);
			expect(applicationFound?.clientSecret?.length).toBe(64);
			expect(applicationFound?.status).toBe(Status.Active);

			await applicationRepository.deleteById(application.id);
		});
	});

	describe("updateApplicationStatus", () => {
		it("should update the status of an application", async () => {
			const application = await applicationService.createApplication({
				name: "Columbidae",
				homepage: "https://columbidae.example.com",
				description: "This is an example application",
			});

			await applicationService.updateApplicationStatus(application.id, {
				status: Status.Inactive,
			});

			const applicationFound = await applicationService.getApplication(application.id);
			expect(applicationFound?.name).toBe("Columbidae");
			expect(applicationFound?.homepage).toBe("https://columbidae.example.com");
			expect(applicationFound?.description).toBe("This is an example application");
			expect(applicationFound?.clientId?.length).toBe(36);
			expect(applicationFound?.clientSecret?.length).toBe(64);
			expect(applicationFound?.status).toBe(Status.Inactive);

			await applicationRepository.deleteById(application.id);
		});
	});

	describe("deleteApplication", () => {
		it("should delete the application", async () => {
			const application = await applicationService.createApplication({
				name: "Columbidae",
				homepage: "https://columbidae.example.com",
				description: "This is an example application",
			});

			await applicationService.deleteApplication(application.id);

			const applicationFound = await applicationService.getApplication(application.id);
			expect(applicationFound).toBe(null);
		});
	});
});
