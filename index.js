const prompts = require("./prompts.json");
const users = require("./users.json");

// print prompts
// console.log(prompts);

class Prompts {
  constructor(promptsData, usersData) {
    this.prompts = promptsData;
    this.users = usersData;
  }

  create(promptData, username) {
    const newPrompt = {
      ...promptData,
      _id: { $oid: Date.now().toString() },
      actor: { username },
    };
    this.prompts.push(newPrompt);
    return newPrompt;
  }

  getAll(username) {
    return this.prompts.filter((prompt) => this.canAccess(prompt, username));
  }

  canAccess(prompt, username) {
    return (
      prompt.visibility === "public" ||
      prompt.actor.username === username ||
      (prompt.visibility === "custom" && prompt.sharedAccess.includes(username))
    );
  }

  get(promptId, username) {
    const prompt = this.prompts.find((p) => p._id.$oid === promptId);
    if (prompt && this.canAccess(prompt, username)) {
      return prompt;
    }
    return null;
  }

  update(promptId, updatedData, username) {
    const index = this.prompts.findIndex(
      (p) => p._id.$oid === promptId && p.actor.username === username
    );
    if (index !== -1) {
      this.prompts[index] = { ...this.prompts[index], ...updatedData };
      return this.prompts[index];
    }
    return null;
  }

  delete(promptId, username) {
    const index = this.prompts.findIndex(
      (p) => p._id.$oid === promptId && p.actor.username === username
    );
    if (index !== -1) {
      const deletedData = this.prompts.splice(index, 1);
    //   console.log(deletedData);
      return deletedData[0];
    }
    return null;
  }
}

const promptManager = new Prompts(prompts, users);

//Creating a new prompt
const newPrompt = promptManager.create(
  {
    prompt: "New prompt",
    label: "Test",
    visibility: "private",
    description: "A test prompt",
    type: "general",
    subtype: "question",
  },
  "Amjad"
);

// Getting all prompts for a user
console.log("All prompts for user1:", promptManager.getAll("Amjad"));

// Getting a specific prompt
console.log(newPrompt._id.$oid);
console.log(
  "Get prompt by ID:",
  promptManager.get(newPrompt._id.$oid, "Amjad")
);

// Updating a prompt
const updatedPrompt = promptManager.update(
  newPrompt._id.$oid,
  { label: "Updated Test" },
  "Amjad"
);
console.log("Updated prompt:", updatedPrompt);

// Deleting a prompt
const deletedPrompt = promptManager.delete(newPrompt._id.$oid, "Amjad");
console.log("Deleted prompt:", deletedPrompt);
