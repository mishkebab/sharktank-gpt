// require(‘dotenv’).config()
import { Configuration, OpenAIApi } from 'openai';
const OPENAI_API_KEY = "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"

const configuration = new Configuration({
    apiKey: OPENAI_API_KEY
})

const openai = new OpenAIApi(configuration)

const basePromptPrefix = "Write me a tweet about..."


window.addEventListener("DOMContentLoaded", (event) => {
    console.log("DOM fully loaded and parsed");
});