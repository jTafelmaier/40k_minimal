



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

    Array.from(document
        .getElementById(text_side)
        .getElementsByClassName("faction"))
        .forEach(element => element.classList.add("invisible"))

    document
        .getElementById(text_side)
        .getElementsByClassName("selection_factions")[0]
        .classList
        .remove("invisible")
}


function set_value_coordinate(
    element_unit,
    int_health_new) {

    element_unit
        .getElementsByClassName("coordinate remaining")[0]
        .getElementsByClassName("value")[0]
        .textContent = int_health_new
            .toString()

    element_unit
        .getElementsByClassName("count_models_new")[0]
        .textContent = "("
            + Math.ceil(int_health_new
                / parseInt(
                    element_unit
                        .getElementsByClassName("health_per_model")[0]
                        .getElementsByClassName("value")[0]
                        .textContent))
                .toString()
            + " M)"
}


function toggle_mode_list(
    text_side) {

    const element_list = document
        .getElementById(text_side)
        .querySelectorAll(".faction:not(.invisible)")[0]

    if (element_list.classList.contains("constructor")) {
        Array.from(element_list
            .querySelectorAll(".unit_faction"))
            .forEach(element => set_value_coordinate(element, parseInt(element.getElementsByClassName("health_per_model")[0].getElementsByClassName("value")[0].innerText.trim()) * parseInt(element.querySelectorAll(".count_models")[0].textContent.trim())))
    }

    element_list
        .classList
        .toggle("constructor")

    element_list
        .classList
        .toggle("match")
}


function get_int_count_models(
    element_unit) {

    const int_health_per_model = parseInt(element_unit
        .getElementsByClassName("health_per_model")[0]
        .getElementsByClassName("value")[0]
        .innerText
        .trim())

    return Math.ceil(
            get_int_attribute(
                element_unit,
                "current_health")
                / int_health_per_model)
}


function update_points_total(
    text_side) {

    function get_int_points_cost_unit(
        element_unit){

        return get_int_count_models(element_unit)
            * parseInt(
                element_unit
                    .getElementsByClassName("model")[0]
                    .getAttribute("title")
                    .split(" ")
                    .at(1))
    }

    const element_faction = document
        .getElementById(text_side)
        .querySelectorAll(".faction:not(.invisible)")[0]

    const int_points_total = Array.from(element_faction
        .getElementsByClassName("unit_faction"))
        .map(get_int_points_cost_unit)
        .reduce((a, b) => a + b)

    element_faction
        .getElementsByClassName("points_total")[0]
        .textContent = int_points_total
            .toString()
            + " points"
}


function modify_count_models(
    text_side,
    index_unit,
    int_change) {

    const element_unit = document
        .getElementById(text_side)
        .querySelectorAll(".constructor:not(.invisible)")[0]
        .getElementsByClassName("unit_faction")[index_unit]

    const element_count = element_unit
        .getElementsByClassName("count_models")[0]

    const int_count_new = parseInt(
            element_count
                .textContent)
            + int_change

    if (int_count_new < 0) {
       return
    }

    if (int_count_new == 0) {
        element_unit
            .classList
            .add("unselected")
    } else {
        element_unit
            .classList
            .remove("unselected")
    }

    int_health_per_model = parseInt(element_unit
        .getElementsByClassName("health_per_model")[0]
        .getElementsByClassName("value")[0]
        .innerText
        .trim())

    element_count
        .textContent = int_count_new
            .toString()

    element_unit
        .setAttribute(
            "initial_health",
            int_count_new
                * int_health_per_model)

    element_unit
        .setAttribute(
            "current_health",
            int_count_new
                * int_health_per_model)

    update_points_total(text_side)
}


function get_element_unit(
    text_side,
    index_unit) {

    return document
        .getElementById(text_side)
        .querySelectorAll(".faction:not(.invisible)")[0]
        .getElementsByClassName("unit_faction")[index_unit]
}


function mouseenter_attack(
    text_side,
    index_unit) {

    get_element_unit(
            text_side,
            index_unit)
        .getElementsByClassName("section difference")[0]
        .classList
        .add("invisible")
}


function mouseleave_attack(
    text_side,
    index_unit) {

    get_element_unit(
            text_side,
            index_unit)
        .getElementsByClassName("section difference")[0]
        .classList
        .remove("invisible")
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
    
    if (element_unit.parentElement.parentElement.classList.contains("constructor")) {
        return
    }

    element_unit
        .classList
        .add("inactive")

    finish_action(text_side)
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

        int_health_initial = get_int_attribute(
                element_unit,
                "initial_health")

        int_health_current = get_int_attribute(
                element_unit,
                "current_health")

        set_height_bar(
                element_unit
                    .getElementsByClassName("section remaining")[0],
                int_health_current,
                int_health_initial)

        set_height_bar(
                element_unit
                    .getElementsByClassName("coordinate remaining")[0],
                int_health_current,
                int_health_initial)

        set_value_coordinate(
                element_unit,
                int_health_current)

        element_unit
            .classList
            .remove("attacked")
    }

    Array.from(element_army_lists
        .getElementsByClassName("unit_faction"))
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

    if (element_unit_attacking.parentElement.parentElement.classList.contains("constructor")) {
        return
    }

    const element_attack = element_unit_attacking
        .getElementsByClassName("attack")[index_attack]

    function show_preview_attack(
        element_unit_attacked) {

        const int_count_models_attacking = get_int_count_models(element_unit_attacking)

        const int_damage = parseInt(element_attack
            .getElementsByClassName("value")[0]
            .innerText
            .trim())

        const text_type_attack = element_attack
            .getElementsByClassName("type")[0]
            .innerText
            .trim()

        const int_health_per_model = parseInt(element_unit_attacked
            .getElementsByClassName("health_per_model")[0]
            .getElementsByClassName("value")[0]
            .innerText
            .trim())

        const text_type_armor = element_unit_attacked
            .getElementsByClassName("health_per_model")[0]
            .getElementsByClassName("type")[0]
            .innerText
            .trim()

        function get_int_damage_single(
            int_damage_new) {

            // TODO re-implement volume
            if (text_type_attack.includes("single")) return Math.min(int_damage_new, int_health_per_model * int_count_models_attacking)
            else return int_damage_new
        }

        const int_health_initial = get_int_attribute(
                element_unit_attacked,
                "initial_health")

        const int_health_current = get_int_attribute(
                element_unit_attacked,
                "current_health")

        const int_damage_added = Math.min(
                int_health_current,
                get_int_damage_single(
                    int_count_models_attacking
                        * int_damage))

        const element_difference = element_unit_attacked
            .getElementsByClassName("section difference")[0]

        set_height_bar(
                element_difference,
                int_damage_added,
                int_health_initial)

        set_height_bar(
                element_unit_attacked
                    .getElementsByClassName("section remaining")[0],
                int_health_current
                    - int_damage_added,
                int_health_initial)

        set_height_bar(
                element_unit_attacked
                    .getElementsByClassName("coordinate remaining")[0],
                int_health_current
                    - int_damage_added,
                int_health_initial)

        set_value_coordinate(
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
            "initial_health")

    const int_health_points_new = get_int_attribute(
            element_unit,
            "current_health")
        - get_int_attribute(
            element_unit
                .getElementsByClassName("section difference")[0],
            "value")

    element_unit
        .setAttribute(
            "current_health",
            int_health_points_new
                .toString())

    set_height_bar(
            element_unit
                .getElementsByClassName("section remaining")[0],
            int_health_points_new,
            int_health_initial)

    set_height_bar(
            element_unit
                .getElementsByClassName("coordinate remaining")[0],
            int_health_points_new,
            int_health_initial)

    set_value_coordinate(
            element_unit,
            int_health_points_new)

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

    update_points_total(text_side)
}

