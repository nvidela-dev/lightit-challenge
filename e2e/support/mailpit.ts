const MAILPIT_API = "http://localhost:8025/api/v1";

interface MailpitAddress {
  Address: string;
  Name: string;
}

interface MailpitMessage {
  ID: string;
  From: MailpitAddress;
  To: MailpitAddress[];
  Subject: string;
  Snippet: string;
}

interface MailpitResponse {
  messages: MailpitMessage[];
  total: number;
}

export const mailpit = {
  async getMessages(): Promise<MailpitMessage[]> {
    const response = await fetch(`${MAILPIT_API}/messages`);
    const data: MailpitResponse = await response.json();
    return data.messages;
  },

  async findByRecipient(email: string): Promise<MailpitMessage | undefined> {
    const messages = await this.getMessages();
    return messages.find((m) => m.To.some((t) => t.Address === email));
  },

  async waitForEmail(
    email: string,
    timeoutMs = 15000
  ): Promise<MailpitMessage> {
    const start = Date.now();
    while (Date.now() - start < timeoutMs) {
      const message = await this.findByRecipient(email);
      if (message) return message;
      await new Promise((resolve) => setTimeout(resolve, 500));
    }
    throw new Error(`Email to ${email} not received within ${timeoutMs}ms`);
  },

  async clear(): Promise<void> {
    await fetch(`${MAILPIT_API}/messages`, { method: "DELETE" });
  },

  async getMessageHtml(messageId: string): Promise<string> {
    const response = await fetch(`${MAILPIT_API}/message/${messageId}`);
    const data = await response.json();
    return data.HTML || data.Text || "";
  },
};
