
document.addEventListener("DOMContentLoaded", function () {
    const startSelect = document.getElementById("currentLocation");
    const endSelect = document.getElementById("destination");
    const findButton = document.getElementById("findRouteButton");

    const routeOne = document.getElementById("routeOne");
    const routeTwo = document.getElementById("routeTwo");
    const routeOneSummary = document.getElementById("routeOneSummary");
    const routeTwoSummary = document.getElementById("routeTwoSummary");

    const routeMessage = document.getElementById("routeMessage");
    const directionList = document.getElementById("directionList");
    const routeSketch = document.getElementById("routeSketch");
    const mapNote = document.getElementById("mapNote");

    const destinationTitle = document.getElementById("destinationTitle");
    const destinationDescription = document.getElementById("destinationDescription");
    const image1 = document.getElementById("destinationImage1");
    const image2 = document.getElementById("destinationImage2");
    const caption1 = document.getElementById("destinationCaption1");
    const caption2 = document.getElementById("destinationCaption2");

    let selectedRoute = 1;
    let journeyRequested = false;

    /*
      Destination photos.
      Filenames must exactly match files in static/images.
    */
    const destinationInfo = {
        gate: {
            title: "Main Gate",
            description: "Explore the main entrance of the campus.",
            images: ["Main-Gate.jpg", "main-gate-area.jpg"],
            captions: ["Main Gate", "Gate Area"]
        },
        canteen: {
            title: "Canteen",
            description: "Explore the canteen before you visit.",
            images: ["canteen.jpg", "canteen-inner.jpg"],
            captions: ["Canteen Outside", "Canteen Inside"]
        },
        mba: {
            title: "MBA Building",
            description: "Explore the MBA building.",
            images: ["Mba-building.jpg", "MBA-outer-building.jpg"],
            captions: ["MBA Building", "Building Outside"]
        },
        engineering: {
            title: "Engineering Building",
            description: "Engineering campus building.",
            images: ["engineering-building.jpg", "main campus photo.jpg"],
            captions: ["Engineering Building", "Campus View"]
        },
        pharmacy: {
            title: "Pharmacy Building",
            description: "Pharmacy campus building.",
            images: ["pharmacy-building.jpg", "main campus photo.jpg"],
            captions: ["Pharmacy Building", "Campus View"]
        },
        polytechnic: {
            title: "Polytechnic Building",
            description: "Polytechnic campus building.",
            images: ["polytechnic-building.jpg", "main campus photo.jpg"],
            captions: ["Polytechnic Building", "Campus View"]
        },
        school: {
            title: "11th & 12th Building",
            description: "Explore the school building.",
            images: ["main campus photo.jpg", "campus-map.jpg"],
            captions: ["Campus View", "Campus Map"]
        },
        principal: {
            title: "Principal Office",
            description: "Principal office location.",
            images: ["principal-office.jpg", "principal-cabin-outer.jpg"],
            captions: ["Principal Office", "Office Outside"]
        },
        library: {
            title: "Library",
            description: "Explore the campus library.",
            images: ["school library outer.jpg.jpeg", "campus-map.jpg"],
            captions: ["Library", "Campus Map"]
        },
        bcsClass: {
            title: "BCS Computer Science Class",
            description: "Computer Science classroom location.",
            images: [
                "t.y.bcs-classroom-MBA-building.jpg",
                "Mba-building.jpg"
            ],
            captions: ["BCS Classroom", "MBA Building"]
        },
        xerox: {
            title: "Xerox Shop",
            description: "Campus Xerox shop location.",
            images: ["xerox-shop.jpg", "main campus photo.jpg"],
            captions: ["Xerox Shop", "Campus View"]
        },
        mechanical: {
            title: "Mechanical Building",
            description: "Mechanical building photos need to be added.",
            images: [],
            captions: []
        },
        amphitheater: {
            title: "Amphitheater",
            description: "Amphitheater photos need to be added.",
            images: [],
            captions: []
        },
        libraryEntrance: {
            title: "Engineering Library Entrance",
            description: "Engineering library entrance.",
            images: ["school library outer.jpg.jpeg", "campus-map.jpg"],
            captions: ["Library View", "Campus Map"]
        }
    };

    /*
      Add verified route information here later.
      The route format is:
      "start-destination": {
          1: { directions: ["First confirmed step", "Second confirmed step"] },
          2: { directions: ["Alternate confirmed step"] }
      }

      Do not enter guessed directions.
    */
    const campusRoutes = {
    "gate-mba": {
        1: {
            directions: [
                "Start at Main Gate.",
                "Follow the campus map toward MBA Building.",
                "Confirm the exact path on the campus map."
            ]
        },
        2: {
            directions: [
                "Start at Main Gate.",
                "Use the campus map to check for an alternate path.",
                "Alternate path is not verified yet."
            ]
        }
    }
};

    function getLocationName(select) {
        return select.options[select.selectedIndex].text;
    }

    function getImagePath(filename) {
        return "/static/images/" + filename
            .split("/")
            .map(function (part) {
                return encodeURIComponent(part);
            })
            .join("/");
    }

    function setPhoto(img, caption, filename, captionText) {
        caption.textContent = captionText || "Destination Photo";

        if (!filename) {
            img.removeAttribute("src");
            img.style.display = "none";
            caption.textContent = "Photo not available yet";
            return;
        }

        img.style.display = "block";
        img.alt = captionText || "Destination Photo";
        img.src = getImagePath(filename);

        img.onerror = function () {
            img.style.display = "none";
            caption.textContent = "Photo file not found";
        };
    }

    function updateDestinationPhotos() {
        const info = destinationInfo[endSelect.value];

        if (!info) {
            destinationTitle.textContent =
                "📸 " + getLocationName(endSelect);
            destinationDescription.textContent =
                "Photos have not been configured for this destination.";

            setPhoto(image1, caption1, null, "");
            setPhoto(image2, caption2, null, "");
            return;
        }

        destinationTitle.textContent = "📸 " + info.title;
        destinationDescription.textContent = info.description;

        setPhoto(
            image1,
            caption1,
            info.images[0],
            info.captions[0]
        );

        setPhoto(
            image2,
            caption2,
            info.images[1],
            info.captions[1]
        );
    }

    function addDirection(text) {
        const step = document.createElement("div");
        step.className = "direction-step";
        step.textContent = text;
        directionList.appendChild(step);
    }

    function createSketchItem(text, number, className) {
        const item = document.createElement("div");
        item.className = className;

        if (number !== null) {
            const badge = document.createElement("span");
            badge.className = "sketch-number";
            badge.textContent = number;
            item.appendChild(badge);
        }

        const label = document.createElement("span");
        label.textContent = text;
        item.appendChild(label);

        return item;
    }

    function drawRouteSketch(startName, endName, directions) {
        routeSketch.replaceChildren();

        routeSketch.appendChild(
            createSketchItem("START: " + startName, null, "sketch-start")
        );

        directions.forEach(function (direction, index) {
            const arrow = document.createElement("div");
            arrow.className = "sketch-arrow";
            arrow.textContent = "↓";
            routeSketch.appendChild(arrow);

            routeSketch.appendChild(
                createSketchItem(
                    direction,
                    index + 1,
                    "sketch-step"
                )
            );
        });

        const finalArrow = document.createElement("div");
        finalArrow.className = "sketch-arrow";
        finalArrow.textContent = "↓";
        routeSketch.appendChild(finalArrow);

        routeSketch.appendChild(
            createSketchItem(
                "DESTINATION: " + endName,
                null,
                "sketch-end"
            )
        );
    }

    function resetRouteOptions() {
        routeOne.classList.toggle("selected", selectedRoute === 1);
        routeTwo.classList.toggle("selected", selectedRoute === 2);
    }

    function showRoute() {
        const start = startSelect.value;
        const end = endSelect.value;

        directionList.replaceChildren();

        if (start === end) {
            routeMessage.textContent =
                "Your starting location and destination are the same. Please select two different locations.";

            addDirection("Choose a different destination.");
            drawRouteSketch(
                getLocationName(startSelect),
                getLocationName(endSelect),
                ["Choose a different destination."]
            );

            mapNote.textContent = "Select two different locations.";
            return;
        }

        const routeSet = campusRoutes[start + "-" + end];
        const route = routeSet && routeSet[selectedRoute];

        if (!route) {
            routeMessage.textContent =
                "Journey: " + getLocationName(startSelect) +
                " → " + getLocationName(endSelect) +
                ". Exact turn-by-turn directions are not configured yet.";

            addDirection("🟢 Start: " + getLocationName(startSelect));
            addDirection("🗺️ Refer to the campus map to identify the location.");
            addDirection("🔴 Destination: " + getLocationName(endSelect));

            drawRouteSketch(
                getLocationName(startSelect),
                getLocationName(endSelect),
                ["Exact campus directions have not been configured yet."]
            );

            mapNote.textContent =
                "The campus map is displayed above. Route highlighting requires verified path details.";

            routeOneSummary.textContent =
                "Directions not configured for this journey yet.";

            routeTwoSummary.textContent =
                "Alternate path not configured yet.";

            return;
        }

        routeMessage.textContent =
            "Route " + selectedRoute + ": " +
            getLocationName(startSelect) + " → " +
            getLocationName(endSelect);

        addDirection("🟢 Start: " + getLocationName(startSelect));

        route.directions.forEach(function (direction, index) {
            addDirection((index + 1) + ". " + direction);
        });

        addDirection("🔴 Destination: " + getLocationName(endSelect));

        drawRouteSketch(
            getLocationName(startSelect),
            getLocationName(endSelect),
            route.directions
        );

        mapNote.textContent =
            "Route " + selectedRoute +
            " selected. The map image itself is not automatically highlighted.";

        routeOneSummary.textContent =
            selectedRoute === 1
                ? "Selected route: " + getLocationName(startSelect) +
                  " → " + getLocationName(endSelect)
                : "Route 1 is available if configured.";

        routeTwoSummary.textContent =
            selectedRoute === 2
                ? "Selected alternate route."
                : "Route 2 is available if configured.";
    }

   
function selectRoute(number) {
    selectedRoute = number;
    journeyRequested = true;

    resetRouteOptions();
    updateDestinationPhotos();
    showRoute();

    document.getElementById("campus-map").scrollIntoView({
        behavior: "smooth",
        block: "start"
    });
}


    findButton.addEventListener("click", function () {
        journeyRequested = true;
        selectedRoute = 1;
        resetRouteOptions();

        updateDestinationPhotos();

        routeOneSummary.textContent =
            getLocationName(startSelect) + " → " +
            getLocationName(endSelect);

        routeTwoSummary.textContent =
            "Alternate route appears when verified and configured.";

        showRoute();

        document.getElementById("destinationGallery").scrollIntoView({
            behavior: "smooth",
            block: "start"
        });
    });

    routeOne.addEventListener("click", function () {
        selectRoute(1);
    });

    routeTwo.addEventListener("click", function () {
        selectRoute(2);
    });

    startSelect.addEventListener("change", function () {
        journeyRequested = false;
        routeMessage.textContent =
            "Starting location changed. Click Find My Route.";
    });

    endSelect.addEventListener("change", function () {
        journeyRequested = false;
        updateDestinationPhotos();

        routeMessage.textContent =
            "Destination changed. Click Find My Route.";
    });

    // Show the selected destination's photos on initial page load.
    updateDestinationPhotos();
    resetRouteOptions();
});
