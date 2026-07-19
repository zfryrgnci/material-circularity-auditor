import { describe, it, expect } from "vitest";
import request from "supertest";
import { app } from "../server.js";

describe("POST /api/audit", () => {
  it("should return 400 if text is missing", async () => {
    const response = await request(app)
      .post("/api/audit")
      .send({});
    
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("error");
  });

  it("should return mocked audit data", async () => {
    const response = await request(app)
      .post("/api/audit")
      .send({ text: "10 timber doors" });
    
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("projectName");
    expect(response.body).toHaveProperty("materials");
    expect(response.body.materials[0].category).toBe("Timber");
  });
});

describe("GET /api/projects", () => {
  it("should return active projects", async () => {
    const response = await request(app).get("/api/projects");
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });
});
