let currentData = [];
let currentAnimal = "";
let isMetric = true;

function loadCSV(filePath, callback) {
  fetch(filePath)
    .then((response) => response.text())
    .then((data) => {
      const rows = data.split("\n").slice(1);
      const parsedData = rows.map((row) => {
        const columns = row.split(",");
        return {
          animal: columns[0].trim(),
          land: columns[1].trim(),
          water: columns[2].trim(),
          grain: columns[3].trim(),
          co2: columns[4].trim(),
          lifespan: columns[5].trim(),
          slaughter_number: columns[6]?.trim(),
        };
      });
      callback(parsedData);
    })
    .catch((error) => console.error("Error loading CSV:", error));
}

function loadData() {
  const filePath = isMetric ? "data/stats_metric.csv" : "data/stats_imperial.csv";
  loadCSV(filePath, (data) => {
    currentData = data;
    console.log(`${isMetric ? "Metric" : "Imperial"} Data Loaded:`, currentData);

    if (currentAnimal) {
      updateStats(currentAnimal);
    } else {
      setDefaultStats();
    }
  });
}

function setDefaultStats() {
  document.getElementById("land-text").textContent = "Land used";
  document.getElementById("water-text").textContent = "Water used";
  document.getElementById("grain-text").textContent = "Grain used";
  document.getElementById("co2-text").textContent = "CO₂ emitted";
  document.getElementById("lifespan-text").textContent = "Life expectancy";
  document.getElementById("slaughter-text").textContent = "Animals slaughtered";
}

function updateStats(animal) {
  const stats = currentData.find((row) => row.animal.toLowerCase() === animal.toLowerCase());

  if (stats) {
    document.getElementById("land-text").textContent = stats.land;
    document.getElementById("water-text").textContent = stats.water;
    document.getElementById("grain-text").textContent = stats.grain;
    document.getElementById("co2-text").textContent = stats.co2;
    document.getElementById("lifespan-text").textContent = stats.lifespan;
    document.getElementById("slaughter-text").textContent = stats.slaughter_number;
  } else {
    console.error(`No stats found for ${animal}`);
  }
}

document.querySelectorAll(".animal-images img").forEach((img) => {
  img.addEventListener("click", () => {
    const animalName = img.alt;
    currentAnimal = img.dataset.animal;
    document.getElementById("animal-title").textContent = animalName;
    updateStats(currentAnimal);
  });
});

document.getElementById("metric").addEventListener("click", () => {
  if (!isMetric) {
    isMetric = true;
    document.getElementById("metric").classList.add("active");
    document.getElementById("imperial").classList.remove("active");
    loadData();
  }
});

document.getElementById("imperial").addEventListener("click", () => {
  if (isMetric) {
    isMetric = false;
    document.getElementById("imperial").classList.add("active");
    document.getElementById("metric").classList.remove("active");
    loadData();
  }
});

loadData();

window.addEventListener('DOMContentLoaded', function () {
  let startTime = new Date().getTime();

  function updateTime() {
    const currentTime = new Date().getTime();
    const elapsedTime = Math.floor((currentTime - startTime) / 1000);

    const minutes = Math.floor(elapsedTime / 60);
    const seconds = elapsedTime % 60;

    let timeString = `${seconds} second${seconds !== 1 ? 's' : ''}`;
    if (minutes > 0) {
      timeString = `${minutes} minute${minutes !== 1 ? 's' : ''} and ` + timeString;
    }

    document.getElementById('time-elapsed').textContent = timeString;
  }

  setInterval(updateTime, 1000);
});

window.addEventListener('DOMContentLoaded', function () {
  var updatesPerSecond = 20;
  var animalsKilledPerYear = {
    "wild_caught_fish": 970000000000,
    "chickens": 61171973510,
    "farmed_fish": 38000000000,
    "ducks": 2887594480,
    "pigs": 1451856889.38,
    "rabbits": 1171578000,
    "geese": 687147000,
    "turkeys": 618086890,
    "sheep": 536742256.33,
    "goats": 438320370.99,
    "cattle": 298799160.08,
    "rodents": 70371000,
    "other_birds": 59656000,
    "buffalo": 25798819,
    "horses": 4863367,
    "donkeys": 3213400,
    "camels": 3243266.03,
  };

  var secondsPerYear = 365 * 24 * 60 * 60;
  var interval = 1000 / updatesPerSecond;
  var count = 0, start = new Date().getTime();

  function update(intervalCount) {
    for (var subset in animalsKilledPerYear) {
      var numKilled = animalsKilledPerYear[subset];
      var countElement = document.getElementById("akc-" + subset);
      if (countElement) {
        countElement.innerHTML = Math.round(
          intervalCount * (numKilled / secondsPerYear) / updatesPerSecond
        ).toLocaleString();
      }
    }
  }

  function selfCorrectingTimeoutInterval() {
    update(++count);
    window.setTimeout(
      selfCorrectingTimeoutInterval,
      interval - (new Date().getTime() - start - count * interval)
    );
  }
  window.setTimeout(selfCorrectingTimeoutInterval, interval);
});

const factors = {
  vegan: {
    daily: { animals: 1, water: 4164, grain: 18, land: 3, co2: 9 },
    monthly: { animals: 30, water: 125000, grain: 548, land: 91, co2: 274 },
    yearly: { animals: 365, water: 1520901, grain: 6575, land: 1096, co2: 3287 },
  },
  vegetarian: {
    daily: { animals: 0.5, water: 2082, grain: 9, land: 1.5, co2: 4.5 },
    monthly: { animals: 15, water: 62500, grain: 274, land: 45.5, co2: 137 },
    yearly: { animals: 182.5, water: 760451, grain: 3287.5, land: 547.5, co2: 1643.5 },
  },
};

let isMetricCalc = true;
let currentType = "vegan";

document.addEventListener("DOMContentLoaded", () => {
  document.querySelector("#saves-animals").textContent = "0 Animal Lives";
  document.querySelector("#saves-water").textContent = isMetricCalc
    ? "0 Liters of Water"
    : "0 Gallons of Water";
  document.querySelector("#saves-grain").textContent = isMetricCalc
    ? "0 kg of Grain"
    : "0 lbs of Grain";
  document.querySelector("#saves-land").textContent = isMetricCalc
    ? "0 m² of Forested Land"
    : "0 ft² of Forested Land";
  document.querySelector("#saves-co2").textContent = isMetricCalc
    ? "0 kg of CO₂"
    : "0 lbs of CO₂";
});

document.querySelector("#calc-metric").addEventListener("click", () => {
  isMetricCalc = true;
  updateCalculator();
});

document.querySelector("#calc-imperial").addEventListener("click", () => {
  isMetricCalc = false;
  updateCalculator();
});

document.querySelectorAll(".toggle-buttons button").forEach((btn) =>
  btn.addEventListener("click", (e) => {
    currentType = e.target.id;
    document.querySelectorAll(".toggle-buttons button").forEach((b) => b.classList.remove("active"));
    e.target.classList.add("active");
    updateCalculator();
  })
);

["#days", "#months", "#years"].forEach((id) => {
  document.querySelector(id).addEventListener("input", updateCalculator);
});

function updateCalculator() {
  const days = parseInt(document.querySelector("#days").value) || 0;
  const months = parseInt(document.querySelector("#months").value) || 0;
  const years = parseInt(document.querySelector("#years").value) || 0;

  const total = {
    animals:
      days * factors[currentType].daily.animals +
      months * factors[currentType].monthly.animals +
      years * factors[currentType].yearly.animals,
    water:
      days * factors[currentType].daily.water +
      months * factors[currentType].monthly.water +
      years * factors[currentType].yearly.water,
    grain:
      days * factors[currentType].daily.grain +
      months * factors[currentType].monthly.grain +
      years * factors[currentType].yearly.grain,
    land:
      days * factors[currentType].daily.land +
      months * factors[currentType].monthly.land +
      years * factors[currentType].yearly.land,
    co2:
      days * factors[currentType].daily.co2 +
      months * factors[currentType].monthly.co2 +
      years * factors[currentType].yearly.co2,
  };

  document.querySelector("#saves-animals").textContent = `${Math.round(total.animals)} Animal Lives`;
  document.querySelector("#saves-water").textContent = isMetricCalc
    ? `${Math.round(total.water)} Liters of Water`
    : `${Math.round(total.water * 0.264172)} Gallons of Water`;
  document.querySelector("#saves-grain").textContent = isMetricCalc
    ? `${Math.round(total.grain)} kg of Grain`
    : `${Math.round(total.grain * 2.20462)} lbs of Grain`;
  document.querySelector("#saves-land").textContent = isMetricCalc
    ? `${Math.round(total.land)} m² of Forested Land`
    : `${Math.round(total.land * 10.7639)} ft² of Forested Land`;
  document.querySelector("#saves-co2").textContent = isMetricCalc
    ? `${Math.round(total.co2)} kg of CO₂`
    : `${Math.round(total.co2 * 2.20462)} lbs of CO₂`;
}
