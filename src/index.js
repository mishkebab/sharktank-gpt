import { Configuration, OpenAIApi } from 'openai';
import OPENAI_API_KEY from '../open_ai';
// import { update } from 'immutable';
import { renderScreen1 } from "./scripts/screen1";
import { renderScreen2 } from "./scripts/screen2";
import { renderScreen3 } from "./scripts/screen3";
import { renderScreen4 } from "./scripts/screen4";

const canvasEl = document.getElementById("game-canvas");
const ctx = canvasEl.getContext("2d");
renderScreen1(canvasEl, ctx, renderScreen2, renderScreen3, renderScreen4);

// renderScreen4("test", "2", "test", "2","test", "1","test", "1","test", "1");
// renderScreen4("Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.", "1", "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.", "2");
// renderScreen3("sdfsd","sdfsd");






