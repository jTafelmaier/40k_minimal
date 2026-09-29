



function get_int_attribute(
    element,
    text_attribute) {

    return parseInt(
            element
                .getAttribute(text_attribute))
}


function get_int_unit_property(
    element,
    text_property) {

    return parseInt(element
            .getElementsByClassName(text_property)[0]
            .getElementsByClassName("value")[0]
            .innerText
            .trim())
}


function display_faction(
    text_side,
    name_faction){

    document
        .getElementById(text_side)
        .getElementsByClassName("selection_factions")[0]
        .classList
        .add("invisible")

    document
        .getElementById(text_side)
        .getElementsByClassName(name_faction)[0]
        .classList
        .remove("invisible")
}


function return_to_faction_selection(
    text_side) {

    document
        .getElementById(text_side)
        .querySelectorAll(".faction:not(.invisible)")[0]
        .classList
        .add("invisible")

    document
        .getElementById(text_side)
        .getElementsByClassName("selection_factions")[0]
        .classList
        .remove("invisible")
}


function set_height_bar(
    element_bar,
    int_steps) {

    const int_health_maximum = parseInt(
            element_bar
                .parentElement
                .getAttribute("health_total"))

    element_bar
        .setAttribute(
            "value",
            int_steps
                .toString())

    element_bar
        .setAttribute(
            "style",
            "height: "
                + Math.floor((100
                    * int_steps)
                    / int_health_maximum)
                    .toString()
                + "%;")
}


function display_unit_state(
    element_unit_type,
    int_health_new) {

    const int_count_models = Math.ceil(
            int_health_new
                / get_int_unit_property(
                    element_unit_type,
                    "health_max"))

    const array_elements_models = Array.from(element_unit_type
        .getElementsByClassName("models")[0]
        .children)

    array_elements_models
        .slice(0, int_count_models)
        .forEach(element => element.classList.add("alive"))

    array_elements_models
        .slice(int_count_models)
        .forEach(element => element.classList.remove("alive"))

    set_height_bar(
            element_unit_type
                .getElementsByClassName("section remaining")[0],
            int_health_new)

    element_unit_type
        .getElementsByClassName("health_bar")[0]
        .setAttribute(
            "title",
            int_health_new
                .toString() 
                + " health points")
}


function toggle_mode_list() {

    document
        .getElementById("factions")
        .classList
        .toggle("match")
}


function get_int_count_models(
    element_unit_type) {

    return element_unit_type
        .getElementsByClassName("models")[0]
        .getElementsByClassName("alive")
        .length
}


function update_requisition_total(
    text_side) {

    function get_int_requisition_unit_type(
        element_unit_type){

        return Array.from(element_unit_type
            .querySelectorAll(".unit_instance"))
            .map(get_int_count_models)
            .reduce((a, b) => a + b)
            * parseInt(
                element_unit_type
                    .getAttribute("requisition"))
    }

    document
        .getElementById("requisition_total")
        .getElementsByClassName(text_side)[0]
        .textContent = Array.from(document
            .getElementById(text_side)
            .querySelectorAll(".faction:not(.invisible)")[0]
            .getElementsByClassName("unit_type"))
            .map(get_int_requisition_unit_type)
            .reduce((a, b) => a + b)
            .toString()
}


function get_element_unit_type(
    text_side,
    index_unit) {

    return document
        .getElementById(text_side)
        .querySelectorAll(".faction:not(.invisible)")[0]
        .getElementsByClassName("unit_type")[index_unit]
}


function set_count_models(
    text_side,
    index_unit,
    int_count_models) {

    const element_unit_type = get_element_unit_type(
            text_side,
            index_unit)

    if (document.getElementById("factions").classList.contains("match")) {
        return
    }

    const int_health_full = int_count_models
        * get_int_unit_property(
            element_unit_type,
            "health_max")

    element_unit_type
        .getElementsByClassName("health_bar")[0]
        .setAttribute(
            "health_current",
            int_health_full
                .toString())

    display_unit_state(
            element_unit_type,
            int_health_full)

    if (int_count_models == 0) {
        element_unit_type
            .classList
            .add("unpicked")
    } else {
        element_unit_type
            .classList
            .remove("unpicked")
    }

    update_requisition_total(text_side)
}


function toggle_count_models(
    text_side,
    index_unit,
    int_count_models_full) {

    const element_unit_type = get_element_unit_type(
            text_side,
            index_unit)

    set_count_models(
            text_side,
            index_unit,
            get_int_count_models(element_unit_type) > 0 ? 0 : int_count_models_full)
}


function test_new_turn() {

    const array_elements_unit_types = Array.from(document
        .querySelectorAll(".unit_type:not(.unpicked)"))

    if (!array_elements_unit_types.every(element => element.classList.contains("already_activated")))
        return

    array_elements_unit_types
        .forEach(element => element.classList.remove("already_activated"))

    const element_turn_counter = document
        .getElementById("turn_counter")

    element_turn_counter.textContent = (parseInt(
            element_turn_counter
                .textContent)
            + 1)
            .toString()
}


// TODO use
function set_inactive(
    text_side,
    index_unit) {

    if (document.getElementById("factions").classList.contains("attack_in_progress")) {
        return
    }

    const element_unit_type = get_element_unit_type(
            text_side,
            index_unit)

    if (!document.getElementById("factions").classList.contains("match")) {
        return
    }

    element_unit_type
        .classList
        .add("already_activated")

    test_new_turn()
}


function hide_preview_attack() {

    const element_army_lists = document
        .getElementById("factions")

    if (!element_army_lists.classList.contains("attack_in_progress")) {
        return
    }

    element_army_lists
        .classList
        .remove("attack_in_progress")

    function unset_attacked(
        element_unit_type) {

        display_unit_state(
                element_unit_type,
                get_int_attribute(
                    element_unit_type
                        .getElementsByClassName("health_bar")[0],
                    "health_current"))

        element_unit_type
            .classList
            .remove("attacked")
    }

    Array.from(element_army_lists
        .getElementsByClassName("attacked"))
        .forEach(unset_attacked)

    const element_unit_attacking = element_army_lists
        .getElementsByClassName("attacking")[0]

    element_unit_attacking
        .getElementsByClassName("activated")[0]
        .classList
        .remove("activated")

    element_unit_attacking
        .classList
        .remove("attacking")

    element_unit_attacking
        .parentElement
        .classList
        .remove("attacking_side")
}


function toggle_select_attack(
    text_side_unit_attacking,
    index_unit_attacking,
    index_attack) {

    const element_unit_attacking = get_element_unit_type(
            text_side_unit_attacking,
            index_unit_attacking)

    if (!document.getElementById("factions").classList.contains("match")) {
        return
    }

    const element_attack = element_unit_attacking
        .getElementsByClassName("attack")[index_attack]

    const bool_currently_activated = element_attack
        .classList
        .contains("activated")

    hide_preview_attack()

    if (bool_currently_activated) {
        return
    }

    function show_preview_attack(
        element_unit_attacked) {

        const text_keywords_attack = element_attack
            .getElementsByClassName("keywords")[0]
            .innerText
            .trim()

        function get_int_damage_consider_volume() {

            const int_strength = parseInt(element_attack
                .getElementsByClassName("value")[0]
                .innerText
                .trim())

            if (text_keywords_attack.includes("volume") && get_int_count_models(element_unit_attacked) > 1) {
                return int_strength
                    * 2}
            else {
                return int_strength
            }
        }

        function get_int_damage_per_attack() {

            int_damage = Math.max(
                    0,
                    get_int_damage_consider_volume()
                        + get_int_unit_property(
                            element_unit_attacked,
                            "damage_reduction"))

            if (text_keywords_attack.includes("single")) {
                return Math.min(
                        int_damage,
                        get_int_unit_property(
                            element_unit_attacked,
                            "health_max"))
            } else {
                return int_damage
            }
        }

        const int_health_current = get_int_attribute(
                element_unit_attacked
                    .getElementsByClassName("health_bar")[0],
                "health_current")

        const int_damage_added = Math.min(
                int_health_current,
                get_int_damage_per_attack()
                    * get_int_count_models(element_unit_attacking))

        set_height_bar(
                element_unit_attacked
                    .getElementsByClassName("section difference")[0],
                int_damage_added)

        display_unit_state(
                element_unit_attacked,
                int_health_current
                    - int_damage_added)

        element_unit_attacked
            .classList
            .add("attacked")
    }

    document
        .getElementById("factions")
        .classList
        .add("attack_in_progress")

    element_unit_attacking
        .parentElement
        .classList
        .add("attacking_side")

    element_unit_attacking
        .classList
        .add("attacking")

    element_attack
        .classList
        .add("activated")

    Array.from(document
        .getElementById(text_side_unit_attacking === "left" ? "right" : "left")
        .querySelectorAll(".faction:not(.invisible)")[0]
        .querySelectorAll(".unit_type:not(.unpicked)"))
        .forEach(show_preview_attack)
}


function apply_preview(
    text_side,
    index_unit) {

    const element_unit_type = get_element_unit_type(
            text_side,
            index_unit)

    if (!element_unit_type.classList.contains("attacked")) {
        return
    }

    const int_health_points_new = get_int_attribute(
            element_unit_type
                .getElementsByClassName("health_bar")[0],
            "health_current")
        - get_int_attribute(
            element_unit_type
                .getElementsByClassName("section difference")[0],
            "value")

    set_height_bar(
            element_unit_type
                .getElementsByClassName("section difference")[0],
            0)

    display_unit_state(
            element_unit_type,
            int_health_points_new)

    element_unit_type
        .getElementsByClassName("health_bar")[0]
        .setAttribute(
            "health_current",
            int_health_points_new
                .toString())

    if (int_health_points_new <= 0) {
        element_unit_type
            .classList
            .add("unpicked")
    }

    document
        .getElementsByClassName("attacking")[0]
        .classList
        .add("already_activated")

    update_requisition_total(text_side)

    hide_preview_attack()

    test_new_turn()
}

