import { loadHiRes } from "./design";
import { submitCreateClicked } from "./user";

// Simply load the hi res
window.onload = function () {
    loadHiRes();
    $("#create-form").on("submit", submitCreateClicked);
};
