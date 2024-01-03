# zkApps Umstad AI Assistant

## Introduction

zkApps Umstad AI Assistant, your expert guide in the world of MINA Protocol, o1js. Designed to assist developers, this chatbot provides in-depth assistance with zkApps o1js which is specifically designed to assist developers working on zkApps development powered by the GPT language model. This project includes two main application:

- **Web Application Chatbot:** zkappsumstad.com
- **CLI Agent:** DOWNLOAD LINK HERE!

# zkApps Umstad Chatbot

## Features

The Umstad AI Assistant offers a comprehensive range of features designed to support developers in various aspects of the MINA Protocol and o1js:

1. **Documentation & General Knowledge:**

   - Access to extensive resources including the Mina Protocol documentation, o1js guides, and Auro Wallet information.
   - Integration with Mina Book and Mina Blog for up-to-date knowledge and insights.
   - Availability of various project documentations to enhance understanding and application.

2. **Example Codebase:**

   - Embedded code examples within the documentation for practical reference.

3. **Projects Repositories:**

   - Embedded codebase of zkApps projects.

4. **Community Interaction and Issue Tracking:**

   - Embedded and processed integration with the Mina Protocol Discord channels, specifically zkapps-developers and zkapps-questions, for community support and engagement.
   - Direct access to o1js GitHub Issues, providing insights into current challenges, bugs, and solutions within the community.

5. **Mainnet Blockchain Information Access:**
   - Direct access to Blockchain Summary, Block and Account Information utilizing Mina Explorer API.
   - Current MINA Price utilizing Coingecko API(TODO: Fix Fetching issue for deployment)

## Best Practices for Asking Questions

1. **Be Specific:** Clearly state your issue or the topic you need assistance with.

2. **Querying issues, errors, problems:** Begin with "I have an issue ..." or "I have a problem ..." for asking about errors, issues, problems, discussion, strange questions etc in order to utilize Issue Tool which queries the Issue Vectors which includes Discord and Github data.

3. **Do not extend the conversation:** Even though `gpt-4-1106-preview` can handle overlong contexts, it is strongly advised that not to extend the conversation too much(For now, ideal 3 questions). Just create new chat after 2-3 questions because every query creates crowded context.

## Technical Details

### Architecture Overview

### Backend Technologies

- **Language and Frameworks:** Built using Next.js functions, OpenAI node.js ensuring robust and scalable performance.
- **Database:** Uses vercel KV db.
- **APIs:** Uses Vercel Functions.

### Security and Compliance

- **Data Privacy:** We store your conversations in the KV db. Do not share confidentials, private keys etc. We are not responsible for Vercel's security.
- **OPENAI API KEY:** Application stores your OpenAI API KEY on the browser local storage. So, if you are using shared computer, please remove your key in the settings panel.

# zkApps Umstad CLI AGENT

TODO

## Features

TODO

## Usage

TODO

### Installation

TODO

### Getting Started

TODO

### Best Practices for Agent

TODO

## Architecture

# Support

For any technical issues or further inquiries, please contact our support team at [berkingurcan@gmail.com](mailto:berkingurcan@gmail.com).

# Acknowledgements

Special thanks to the Mina Protocol zkIgnite program for funding the project and all contributors to this project.
