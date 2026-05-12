



function get_int_attribute(
    element,
    text_attribute) {

    return parseInt(
            element
                .getAttribute(text_attribute))
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
    int_steps,
    int_steps_total) {

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
                    / int_steps_total)
                    .toString()
                + "%;")
}


function display_unit_state(
    element_unit,
    int_health_new) {

    const int_health_per_model = get_int_attribute(
            element_unit,
            "health_per_model")

    const int_health_initial = get_int_attribute(
            element_unit,
            "maximum_health")

    const int_count_models = Math.ceil(
            int_health_new
                / int_health_per_model)

    const array_elements_models = Array.from(element_unit
        .getElementsByClassName("models")[0]
        .children)

    array_elements_models
        .slice(0, int_count_models)
        .forEach(element => element.classList.add("active"))

    array_elements_models
        .slice(int_count_models)
        .forEach(element => element.classList.remove("active"))

    set_height_bar(
            element_unit
                .getElementsByClassName("section remaining")[0],
            int_health_new,
            int_health_initial)
}


function toggle_mode_list(
    text_side) {

    document
        .getElementById(text_side)
        .querySelectorAll(".faction:not(.invisible)")[0]
        .classList
        .toggle("match")
}


function get_int_count_models(
    element_unit) {

    return element_unit
        .getElementsByClassName("models")[0]
        .getElementsByClassName("active")
        .length
}


function update_requisition_total(
    text_side) {

    function get_int_requisition_unit(
        element_unit){

        return get_int_count_models(element_unit)
            * parseInt(
                element_unit
                    .getAttribute("requisition_per_model"))
    }

    const element_faction = document
        .getElementById(text_side)
        .querySelectorAll(".faction:not(.invisible)")[0]

    element_faction
        .getElementsByClassName("requisition_total")[0]
        .textContent = Array.from(element_faction
            .getElementsByClassName("unit_faction"))
            .map(get_int_requisition_unit)
            .reduce((a, b) => a + b)
            .toString()
            + " requisition"
}


function get_element_unit(
    text_side,
    index_unit) {

    return document
        .getElementById(text_side)
        .querySelectorAll(".faction:not(.invisible)")[0]
        .getElementsByClassName("unit_faction")[index_unit]
}


function set_count_models(
    text_side,
    index_unit,
    int_count_models) {

    const element_unit = get_element_unit(
            text_side,
            index_unit)

    if (element_unit.parentElement.parentElement.classList.contains("match")) {
        return
    }

    const int_health_full = int_count_models
        * get_int_attribute(
            element_unit,
            "health_per_model")

    element_unit
        .setAttribute(
            "maximum_health",
            int_health_full
                .toString())

    element_unit
        .setAttribute(
            "current_health",
            int_health_full
                .toString())

    display_unit_state(
            element_unit,
            int_health_full)

    if (int_count_models == 0) {
        element_unit
            .classList
            .add("unselected")
    } else {
        element_unit
            .classList
            .remove("unselected")
    }

    update_requisition_total(text_side)
}


function finish_action(
    text_side) {

    const array_elements_units = Array.from(document
        .querySelectorAll(".unit_faction:not(.unselected)"))

    if (!array_elements_units.every(element => element.classList.contains("inactive")))
        return

    array_elements_units
        .forEach(element => element.classList.remove("inactive"))

    const element_turn_counter = document
        .getElementById("turn_counter")

    element_turn_counter.textContent = (parseInt(
            element_turn_counter
                .textContent)
            + 1)
            .toString()
}


function set_inactive(
    text_side,
    index_unit) {

    if (document.getElementById("factions").classList.contains("attack_in_progress")) {
        return
    }

    const element_unit = get_element_unit(
            text_side,
            index_unit)

    if (!element_unit.parentElement.parentElement.classList.contains("match")) {
        return
    }

    element_unit
        .classList
        .add("inactive")

    finish_action(text_side)
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
        element_unit) {

        display_unit_state(
                element_unit,
                get_int_attribute(
                    element_unit,
                    "current_health"))

        element_unit
            .classList
            .remove("attacked")
    }

    Array.from(element_army_lists
        .getElementsByClassName("attacked"))
        .forEach(unset_attacked)

    const element_unit_attacking = element_army_lists
        .getElementsByClassName("attacking")[0]

    element_unit_attacking
        .getElementsByClassName("selected")[0]
        .classList
        .remove("selected")

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

    const element_unit_attacking = get_element_unit(
            text_side_unit_attacking,
            index_unit_attacking)

    if (!element_unit_attacking.parentElement.parentElement.classList.contains("match")) {
        return
    }

    const element_attack = element_unit_attacking
        .getElementsByClassName("attack")[index_attack]

    function show_preview_attack(
        element_unit_attacked) {

        const text_keywords_attack = element_attack
            .getElementsByClassName("keywords")[0]
            .innerText
            .trim()

        const int_damage_reduction = parseInt(element_unit_attacked
            .getElementsByClassName("damage_reduction")[0]
            .getElementsByClassName("value")[0]
            .innerText
            .trim())

        function get_int_damage_type_attack() {

            const int_damage = parseInt(element_attack
                .getElementsByClassName("value")[0]
                .innerText
                .trim())

            if (text_keywords_attack.includes("single")) {
                return Math.min(
                        int_damage,
                        get_int_attribute(
                            element_unit_attacked,
                            "health_per_model")
                            - int_damage_reduction)
            } else if (text_keywords_attack.includes("volume") && get_int_count_models(element_unit_attacked) == 1) {
                return Math.floor(
                        int_damage
                            / 2)
            } else {
                return int_damage
            }
        }

        const int_health_initial = get_int_attribute(
                element_unit_attacked,
                "maximum_health")

        const int_health_current = get_int_attribute(
                element_unit_attacked,
                "current_health")

        const int_damage_added = Math.min(
                int_health_current,
                Math.max(
                        0,
                        get_int_damage_type_attack()
                            + int_damage_reduction)
                    * get_int_count_models(element_unit_attacking))

        set_height_bar(
                element_unit_attacked
                    .getElementsByClassName("section difference")[0],
                int_damage_added,
                int_health_initial)

        display_unit_state(
                element_unit_attacked,
                int_health_current
                    - int_damage_added)

        element_unit_attacked
            .classList
            .add("attacked")
    }

    const bool_already_selected = element_attack
        .classList
        .contains("selected")

    hide_preview_attack()

    if (bool_already_selected) {
        return
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
        .add("selected")

    Array.from(document
        .getElementById(text_side_unit_attacking === "left" ? "right" : "left")
        .querySelectorAll(".faction:not(.invisible)")[0]
        .querySelectorAll(".unit_faction:not(.unselected)"))
        .forEach(show_preview_attack)
}


function apply_preview(
    text_side,
    index_unit) {

    const element_unit = get_element_unit(
            text_side,
            index_unit)

    const int_health_initial = get_int_attribute(
            element_unit,
            "maximum_health")

    const int_health_points_new = get_int_attribute(
            element_unit,
            "current_health")
        - get_int_attribute(
            element_unit
                .getElementsByClassName("section difference")[0],
            "value")

    display_unit_state(
            element_unit,
            int_health_points_new)

    const int_health_per_model = get_int_attribute(
            element_unit,
            "health_per_model")

    element_unit
        .setAttribute(
            "current_health",
            int_health_points_new
                .toString())

    if (int_health_points_new <= 0) {
        element_unit
            .classList
            .add("unselected")
    }

    document
        .getElementsByClassName("attacking")[0]
        .classList
        .add("inactive")

    finish_action(text_side === "left" ? "right" : "left")

    hide_preview_attack()

    update_requisition_total(text_side)
}

