////////////////////////////////////////////////////////////////////////
//                           Creations                                //
//                                                                    //
////////////////////////////////////////////////////////////////////////

import {
  menDataArray,
  womenDataArray,
  menNames,
  womenNames,
  falseSentences,
} from "./objects.js";

import { createClient } from "@supabase/supabase-js";

/**************************************************************************************/

const randomNumber = Math.random();

let correctKey;
let incorrectKey;

if (randomNumber < 0.5) {
  correctKey = "a";
  incorrectKey = "l";
} else {
  correctKey = "l";
  incorrectKey = "a";
}

/**************************************************************************************/

// Create suffle function - suffles array index randomly
function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

// Suffle men & women data arrays
shuffle(menDataArray);
shuffle(womenDataArray);

// set correct_response to correctKey to all men and women
menDataArray.forEach((man) => (man.correct_response = correctKey));
womenDataArray.forEach((woman) => (woman.correct_response = correctKey));

// set correct_response to incorrectKey and showFalseSentence to true to half of them
for (let i = 0; i < menDataArray.length / 2; i++) {
  menDataArray[i].correct_response = incorrectKey;
  menDataArray[i].showFalseSentence = true;
}

for (let i = 0; i < womenDataArray.length / 2; i++) {
  womenDataArray[i].correct_response = incorrectKey;
  womenDataArray[i].showFalseSentence = true;
}

// Suffle all arrays (data, names & sentences)
shuffle(menDataArray);
shuffle(womenDataArray);
shuffle(menNames);
shuffle(womenNames);
shuffle(falseSentences);

// Add names to men and women

menDataArray.forEach((man, index) => (man.name = menNames[index]));
womenDataArray.forEach((woman, index) => (woman.name = womenNames[index]));

// Create new array concatenating men & women
const peopleDataArray = [...menDataArray, ...womenDataArray];

// add falseSentence to people array
peopleDataArray.forEach(
  (person, index) => (person.falseSentence = falseSentences[index])
);

// suffle people array randomly
shuffle(peopleDataArray);

/**************************************************************************************/

const FACES_URL =
  "https://raw.githubusercontent.com/saramff/face-recognition-reduced/refs/heads/master";
const IMAGES_PER_GENDER = 12;

// Create pictures arrays for men and women faces
const menFaces = Array.from(
  { length: IMAGES_PER_GENDER },
  (_, i) => `${FACES_URL}/caras-antiguas-hombres/man-${i + 1}.jpg`
);
const womenFaces = Array.from(
  { length: IMAGES_PER_GENDER },
  (_, i) => `${FACES_URL}/caras-antiguas-mujeres/woman-${i + 1}.jpg`
);

// Create new array concatenating men & women faces images
const facesImages = [...menFaces, ...womenFaces];

// Create object array for men and women faces {img, correct_response}
const facesObj = facesImages.map((img) => {
  return {
    img: img,
    correct_response: correctKey,
  };
});

// Create pictures arrays for new faces
const newMenFaces = Array.from(
  { length: IMAGES_PER_GENDER },
  (_, i) => `${FACES_URL}/caras-nuevas-hombres/image-${i + 1}.jpg`
);
const newWomenFaces = Array.from(
  { length: IMAGES_PER_GENDER },
  (_, i) => `${FACES_URL}/caras-nuevas-mujeres/image-${i + 1}.jpg`
);

// Create new array concatenating men & women new faces images
const newFacesImages = [...newMenFaces, ...newWomenFaces];

// Create object array for men and women faces {img, correct_response}
const newFacesObj = newFacesImages.map((img) => {
  return {
    img: img,
    correct_response: incorrectKey,
  };
});

// create new array with all faces and shuffle it
const allFacesObj = [...facesObj, ...newFacesObj];
shuffle(allFacesObj);

/**************************************************************************************/

// Get images to preload them
const bodyImgs = peopleDataArray.map((person) => person.bodyImg);
const allImgs = [...bodyImgs, ...facesImages, ...newFacesImages];

/**************************************************************************************/

/* Initialize jsPsych */
let jsPsych = initJsPsych();

/* Create timeline */
let timeline = [];

////////////////////////////////////////////////////////////////////////
//                           Consent                                  //
//                                                                    //
////////////////////////////////////////////////////////////////////////

let check_consent = (elem) => {
  if (document.getElementById("consent_checkbox").checked) {
    return true;
  } else {
    alert(
      "Muchas gracias por su interés en nuestro experimento. Si está listo para participar, por favor, dénos su consentimiento."
    );
    return false;
  }
  return false;
};

let html_block_consent = {
  type: jsPsychExternalHtml,
  url: "consentA2.html",
  cont_btn: "start_experiment",
  check_fn: check_consent,
};
timeline.push(html_block_consent);

// // ////////////////////////////////////////////////////////////////////////
// // //                           Demographic  variables                   //
// // ////////////////////////////////////////////////////////////////////////

/* fullscreen */
timeline.push({
  type: jsPsychFullscreen,
  fullscreen_mode: true,
  message:
    "<p>Por favor, haga clic para cambiar al modo de pantalla completa.</p>",
  button_label: "Continuar",
  on_finish: function (data) {
    var help_fullscreen = data.success;
    jsPsych.data.addProperties({ fullscreen: help_fullscreen });
  },
});

var participantName = {
  type: jsPsychSurveyText,
  preamble: "A continuación, le preguntaremos algunos datos.",
  name: "participantName",
  button_label: "Continuar",
  questions: [
    {
      prompt: "<div>¿Cuál es su nombre y apellidos?<div>",
      rows: 1,
      columns: 2,
      required: "true",
    },
  ],
  data: {
    type: "demo",
    participantName: participantName,
  },
  on_finish: function (data) {
    var help_participantName = data.response.Q0;
    jsPsych.data.addProperties({ participantName: help_participantName });
  },
  on_load: function () {
    document.querySelector(".jspsych-btn").style.marginTop = "20px"; // Adjust margin as needed
  },
};

timeline.push(participantName);

var centroAsociado = {
  type: jsPsychSurveyText,
  name: "centroAsociado",
  button_label: "Continuar",
  questions: [
    {
      prompt: "<div>¿Cuál es su centro asociado?<div>",
      rows: 1,
      columns: 2,
      required: "true",
    },
  ],
  data: {
    type: "demo",
    centroAsociado: centroAsociado,
  },
  on_finish: function (data) {
    var help_centroAsociado = data.response.Q0;
    jsPsych.data.addProperties({ centroAsociado: help_centroAsociado });
  },
  on_load: function () {
    document.querySelector(".jspsych-btn").style.marginTop = "20px"; // Adjust margin as needed
  },
};

timeline.push(centroAsociado);

var age = {
  type: jsPsychSurveyText,
  name: "age",
  button_label: "Continuar",
  questions: [
    {
      prompt: "<div>¿Cuántos años tiene?<div>",
      rows: 1,
      columns: 2,
      required: "true",
    },
  ],
  data: {
    type: "demo",
    age: age,
  },
  on_finish: function (data) {
    var help_age = data.response.Q0;
    jsPsych.data.addProperties({ age: help_age });
  },
  on_load: function () {
    document.querySelector(".jspsych-btn").style.marginTop = "20px"; // Adjust margin as needed
  },
};

timeline.push(age);

var demo2 = {
  type: jsPsychSurveyMultiChoice,
  questions: [
    {
      prompt: "Por favor, seleccione el género con el que se identifica.",
      name: "gender",
      options: ["masculino", "femenino", "otro", "prefiero no decirlo"],
      required: true,
      horizontal: true,
    },
    {
      prompt: "Por favor, seleccione su lengua materna.",
      name: "language",
      options: ["español", "otro"],
      required: true,
      horizontal: true,
    },
  ],
  button_label: "Continuar",
  on_finish: function (data) {
    var help_gender = data.response.gender;
    var help_language = data.response.language;
    jsPsych.data.addProperties({
      gender: help_gender,
      language: help_language,
    });
  },
};
timeline.push(demo2);

/************************************************************************************************ */

/* Preload images */
let preload = {
  type: jsPsychPreload,
  images: allImgs,
};
timeline.push(preload);

/* Fixation trial */
let fixation = {
  type: jsPsychHtmlKeyboardResponse,
  stimulus: '<div style="font-size:60px;">+</div>',
  choices: "NO_KEYS", // Prevent key press
  trial_duration: 500, // Fixation duration
  data: {
    task: "fixation",
  },
};

/* Welcome message trial */
let welcome = {
  type: jsPsychHtmlKeyboardResponse,
  stimulus:
    "Bienvenido al experimento. <br /> </p></p> Pulse la barra espaciadora para comenzar.",
  choices: [" "],
};
timeline.push(welcome);

/**************************************************************************************/

/* Instructions trial */
let instructions = {
  type: jsPsychHtmlKeyboardResponse,
  stimulus: `
    <p>En este experimento se mostrarán automáticamente diferentes personajes uno tras otro.</p>  
    <p>Por favor, preste mucha atención a la apariencia de cada personaje y al nombre que lo acompaña.</p>
    <p>Fíjate en todos los detalles.</p>
    <p>Los personajes aparecerán automáticamente y no necesita hacer nada más que estar atento.</p>
    <p>Cuando esté preparado, pulse la barra espaciadora para empezar.</p>
  `,
  choices: [" "],
  post_trial_gap: 500,
};
timeline.push(instructions);

/* Create stimuli array for image presentation */
let bodyNameStimuli = peopleDataArray.map((person) => {
  return {
    stimulus: `
      <img class="person-img" src="${person.bodyImg}">
      <p class="person-name">${person.name}</p>
    `,
  };
});

/* Image presentation trial */
let test = {
  type: jsPsychHtmlKeyboardResponse,
  stimulus: jsPsych.timelineVariable("stimulus"),
  choices: "NO_KEYS", // Prevent key press
  trial_duration: 1000, // Display each image for 1 second
  post_trial_gap: 500,
};

/* Test procedure: fixation + image presentation */
let test_procedure = {
  timeline: [fixation, test],
  timeline_variables: bodyNameStimuli,
  randomize_order: true, // Randomize image order
};
timeline.push(test_procedure);

/**************************************************************************************/

/* Instructions for recognition phase */
let instructionsrecognition = {
  type: jsPsychHtmlKeyboardResponse,
  stimulus: `
    <p>Ahora verá los personajes junto con una frase asociada.</p>
    <p>Presione '${incorrectKey.toUpperCase()}', si la frase es falsa, y '${correctKey.toUpperCase()}', si la frase es verdadera.</p>
    </p></p>
    <p>Como en este ejemplo: si en la pantalla aparece este personaje y la frase dice 'Ana tiene un bolígrafo', presione '${incorrectKey.toUpperCase()}' (NO).</p>
    <br />
    <div>
      <img src='https://raw.githubusercontent.com/saramff/people-attributes-images/refs/heads/master/Ejemplo-Ana.png'  class="img-instructions" />
    </div>
    <br />
    <p>Le recomendamos colocar los dedos sobre las teclas ${correctKey.toUpperCase()} y ${incorrectKey.toUpperCase()} durante la tarea para no olvidarlas.</p>
    <p>Cuando esté preparado, pulse la barra espaciadora para empezar.</p>
   `,
  choices: [" "],
  post_trial_gap: 500,
};
timeline.push(instructionsrecognition);

/* Create stimuli array for object presentation */
let testPeopleStimuli = peopleDataArray.map((person) => {
  return {
    stimulus: `
      <img class="person-img" src="${person.bodyImg}">
      <p class="person-name">${person.name} ${
        person.showFalseSentence ? person.falseSentence : person.trueSentence
      }</p>
      <div class="keys">
        <p class="${correctKey === "a" ? "left" : "right"}">SÍ</p>
        <p class="${correctKey === "a" ? "right" : "left"}">NO</p>
      </div>
  `,
    correct_response: person.correct_response,
  };
});

/* People presentation trial */
let testPeople = {
  type: jsPsychHtmlKeyboardResponse,
  stimulus: jsPsych.timelineVariable("stimulus"),
  choices: ["a", "l"],
  data: {
    task: "response people presentation",
    correct_response: jsPsych.timelineVariable("correct_response"),
  },
  on_finish: function (data) {
    data.correct = jsPsych.pluginAPI.compareKeys(
      data.response,
      data.correct_response
    );
    data.correct_response_meaning =
      correctKey === data.correct_response ? "YES" : "NO";
  },
};

/* Test procedure: fixation + object presentation */
let test_objects_procedure = {
  timeline: [fixation, testPeople],
  timeline_variables: testPeopleStimuli,
  randomize_order: true, // Randomize object order
};
timeline.push(test_objects_procedure);

/**************************************************************************************/

/* Instructions for Tetris */
let instructionstetris = {
  type: jsPsychHtmlKeyboardResponse,
  stimulus: `
    <p>Ahora jugará al Tetris durante aproximadamente 20 minutos.</p>
    <p>En Tetris, hay piezas de diferentes formas que caen desde la parte superior de la pantalla. <br /> Su objetivo es moverlas y girarlas para que encajen y formen líneas horizontales completas. <br /> Cuando una línea se completa, desaparece. <br /> Si las piezas se acumulan hasta llegar a la parte superior, pierde.</p> <p>Controles:</p> <strong>Flecha izquierda:</strong> Mueve la pieza a la izquierda <br /> <strong>Flecha derecha:</strong> Mueve la pieza a la derecha <br /> <strong>Flecha arriba:</strong> Gira la pieza <br /> <strong>Flecha abajo:</strong> Acelera la caída <p>Cuando aparezca la pantalla del juego, haga clic en <strong>"Play"</strong> para iniciar.</p> <p>Si pierde, seleccione <strong>"Try again"</strong> para reiniciar. <br /> Jugará de esta manera hasta que se agote el tiempo.</p> <p>Pulse la barra espaciadora para comenzar.</p>
  `,
  choices: [" "],
  post_trial_gap: 500,
};
timeline.push(instructionstetris);

/* Tetris */
let tetris = {
  type: jsPsychHtmlKeyboardResponse,
  stimulus: `
    <div class="tetris-visible"></div>
  `,
  post_trial_gap: 500,
  choices: "NO_KEYS", // Prevent key press
  trial_duration: 1200000,
};
timeline.push(tetris);

/**************************************************************************************/

/* Instructions for recognition phase */
let instructionsFaces = {
  type: jsPsychHtmlKeyboardResponse,
  stimulus: `
    <p>Ahora realizará la siguiente tarea:</p>
    <p>Si ha visto antes la cara del personaje, pulse la tecla '${correctKey.toUpperCase()}' (presente).</p>
    <p>Si no ha visto antes la cara del personaje, pulse la tecla '${incorrectKey.toUpperCase()}' (no presente).</p>
    <p>De nuevo, le recomendamos colocar los dedos sobre las teclas ${correctKey.toUpperCase()} y ${incorrectKey.toUpperCase()} durante la tarea para no olvidarlas.</p>
    <p>Pulse la barra espaciadora para comenzar.</p>
   `,
  choices: [" "],
  post_trial_gap: 500,
};
timeline.push(instructionsFaces);

/* Create stimuli array for object presentation */
let testFacesStimuli = allFacesObj.map((face) => {
  return {
    stimulus: `
      <img class="face-img" src="${face.img}">
      <div class="keys">
        <p class="${correctKey === "a" ? "left" : "right"}">PRESENTE</p>
        <p class="${correctKey === "a" ? "right" : "left"}">NO PRESENTE</p>
      </div>
  `,
    correct_response: face.correct_response,
  };
});

/* Faces presentation trial */
let testFaces = {
  type: jsPsychHtmlKeyboardResponse,
  stimulus: jsPsych.timelineVariable("stimulus"),
  choices: ["a", "l"],
  data: {
    task: "response faces presentation",
    correct_response: jsPsych.timelineVariable("correct_response"),
  },
  on_finish: function (data) {
    data.correct = jsPsych.pluginAPI.compareKeys(
      data.response,
      data.correct_response
    );
    data.correct_response_meaning =
      correctKey === data.correct_response ? "YES" : "NO";
  },
};

/* Test procedure: fixation + object presentation */
let testFacesProcedure = {
  timeline: [fixation, testFaces],
  timeline_variables: testFacesStimuli,
  randomize_order: true, // Randomize object order
};
timeline.push(testFacesProcedure);

/**************************************************************************************/

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_API_KEY
);

const TABLE_NAME = "experimento-personajes-reduced";

async function saveData(data) {
  console.log(data);
  const { error } = await supabase.from(TABLE_NAME).insert({ data });

  return { error };
}

const saveDataBlock = {
  type: jsPsychCallFunction,
  func: function() {
    saveData(jsPsych.data.get())
  },
  timing_post_trial: 200
}

timeline.push(saveDataBlock);

// /**************************************************************************************/

/* Goodbye message trial */
let goodbye = {
  type: jsPsychHtmlKeyboardResponse,
  stimulus:
    "Muchas gracias por haber realizado el experimento. <br /> </p></p> Pulsa la barra espaciadora para salir.",
  choices: [" "],
};
timeline.push(goodbye);

// /**************************************************************************************/

/* Run the experiment */
jsPsych.run(timeline);

// Uncomment to see the results on the console (for debugging)
// console.log(jsPsych.data.get());
