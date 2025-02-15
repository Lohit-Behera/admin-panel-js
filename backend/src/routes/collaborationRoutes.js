import { Router } from "express";
import { createCollaboration, allCollaborations, deleteCollaboration } from "../controllers/collaborationController.js";

const collaborationRouter = Router();

collaborationRouter.post("/create", createCollaboration);
collaborationRouter.get("/all", allCollaborations);
collaborationRouter.delete("/delete/:collaborationId", deleteCollaboration);

export default collaborationRouter;