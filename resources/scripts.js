



function get_int_attribute(
    element,
    text_attribute) {

    return parseInt(
            element
                .getAttribute(text_attribute))
}


function display_faction(
    id_faction){

    document
        .getElementById("selection_factions")
        .classList
        .add("invisible")

    document
        .getElementById(id_faction)
        .classList
        .remove("invisible")
}


function return_to_faction_selection() {

    Array.from(document.getElementsByClassName("faction_rules"))
        .forEach(element => element.classList.add("invisible"))

    document
        .getElementById("selection_factions")
        .classList
        .remove("invisible")
}


function add_unit_to_army_list(
    id_faction,
    name_unit) {

    const element_faction = document
        .getElementById(id_faction)

    const dict_new = JSON.parse(element_faction
        .getElementsByClassName("json_object")[0]
        .textContent)

    const object_unit = Array.from(dict_new["units"])
        .find(dict_unit => dict_unit["name"] === name_unit)

    if (object_unit != undefined) {
        object_unit
            ["count_models"] = object_unit
                ["count_models"] 
                + 1
    } else {
        dict_new
            ["units"]
            .push({
                "name": name_unit,
                "count_models": 1})
    }

    element_faction
        .getElementsByClassName("json_object")[0]
        .innerText = JSON.stringify(
            dict_new,
            null,
            "    ")

    function get_int_points_cost(
        element) {

        const object_unit_selected = Array.from(dict_new["units"])
            .find(object_unit => object_unit["name"] == element.getElementsByClassName("name")[0].textContent.trim())

        if (object_unit_selected != undefined) {
            return parseInt(element
                .getAttribute("title")
                .split(" ")
                .at(1))
                * object_unit_selected
                    ["count_models"]
        } else {
            return 0
        }

    }

    element_faction
        .getElementsByClassName("points_total")[0]
        .innerText = Array.from(element_faction
            .getElementsByClassName("model"))
            .map(get_int_points_cost)
            .reduce((a, b) => a + b)
            .toString()
            + " points"
}


function mouseenter_attack(
    text_side,
    index_unit) {

    get_element_unit_army_list(
            text_side,
            index_unit)
        .getElementsByClassName("section difference")[0]
        .classList
        .add("invisible")
}


function mouseleave_attack(
    text_side,
    index_unit) {

    get_element_unit_army_list(
            text_side,
            index_unit)
        .getElementsByClassName("section difference")[0]
        .classList
        .remove("invisible")
}


function finish_action(
    text_side,
    text_message) {

    const text_other_side = text_side === "left" ? "right" : "left"

    document
        .getElementById(text_side)
        .getElementsByClassName("summary")[0]
        .innerText = text_message

    document
        .getElementById(text_other_side)
        .getElementsByClassName("summary")[0]
        .innerText = ""

    const array_elements_units = Array.from(document
        .getElementsByClassName("unit_army_list"))

    if (!array_elements_units.every(element => element.classList.contains("inactive") || element.classList.contains("destroyed")))
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


function get_element_unit_army_list(
    text_side,
    index_unit) {

    return document
        .getElementById(text_side)
        .getElementsByClassName("unit_army_list")[index_unit]
}


function set_inactive(
    text_side,
    index_unit) {

    if (document.getElementById("army_lists").classList.contains("attack_in_progress")) return

    const element_unit = get_element_unit_army_list(
            text_side,
            index_unit)
    
    element_unit
        .classList
        .add("inactive")

    finish_action(
        text_side,
        "Moved unit: "
            + element_unit
                .getElementsByClassName("name")[0]
                .textContent)
}


const INT_HEALTH_POINTS = 8


function get_int_count_models(
    element_unit) {

    return Math.ceil(
            get_int_attribute(
                element_unit,
                "current_health")
                / INT_HEALTH_POINTS)
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

    const element_side = document
        .getElementById(text_side)

    const int_points_total = Array.from(element_side
        .getElementsByClassName("unit_army_list"))
        .map(get_int_points_cost_unit)
        .reduce((a, b) => a + b)

    element_side
        .getElementsByClassName("points_total")[0]
        .textContent = int_points_total
            .toString()
            + " points"
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


function set_text_bar(
    element_bar,
    int_health_new) {

    element_bar
        .textContent = (int_health_new
            / INT_HEALTH_POINTS)
            .toFixed(2)
}


function hide_preview_attack() {

    const element_army_lists = document
        .getElementById("army_lists")

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

        set_text_bar(
                element_unit
                    .getElementsByClassName("coordinate remaining")[0],
                int_health_current)

        element_unit
            .classList
            .remove("attacked")
    }

    Array.from(element_army_lists
        .getElementsByClassName("unit_army_list"))
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

    const element_unit_attacking = get_element_unit_army_list(
            text_side_unit_attacking,
            index_unit_attacking)

    const element_attack = element_unit_attacking
        .getElementsByClassName("attack")[index_attack]

    function show_preview_attack(
        element_unit_attacked) {

        const int_count_models_attacking = get_int_count_models(element_unit_attacking)

        const int_strength = parseInt(element_attack
            .getElementsByClassName("value")[0]
            .innerText
            .trim())

        const text_type_attack = element_attack
            .getElementsByClassName("type")[0]
            .innerText
            .trim()

        const int_armor = parseInt(element_unit_attacked
            .getElementsByClassName("armor")[0]
            .getElementsByClassName("value")[0]
            .innerText
            .trim())

        const text_type_armor = element_unit_attacked
            .getElementsByClassName("armor")[0]
            .getElementsByClassName("type")[0]
            .innerText
            .trim()

        function get_int_damage_single(
            int_damage) {

            if (text_type_attack.includes("single")) return Math.min(int_damage, INT_HEALTH_POINTS * int_count_models_attacking)
            else return int_damage
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
                    Math.floor(
                        INT_HEALTH_POINTS
                            * int_count_models_attacking
                            * Math.pow(
                                2,
                                int_strength
                                    - int_armor
                                    - (text_type_attack.includes("volume") && get_int_count_models(element_unit_attacked) === 1 ? 1 : 0)))))

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

        set_text_bar(
                element_unit_attacked
                    .getElementsByClassName("coordinate remaining")[0],
                int_damage_added
                    * -1)

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
        .getElementById("army_lists")
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
        .getElementsByClassName("unit_army_list"))
        .forEach(show_preview_attack)
}


function apply_preview(
    text_side,
    index_unit) {

    const element_unit = get_element_unit_army_list(
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

    set_text_bar(
            element_unit
                .getElementsByClassName("coordinate remaining")[0],
            int_health_points_new)

    if (int_health_points_new <= 0) {
        element_unit
            .classList
            .add("destroyed")
    }

    const text_other_side = text_side === "left" ? "right" : "left"

    const element_unit_attacking = document
        .getElementsByClassName("attacking")[0]

    element_unit_attacking
        .classList
        .add("inactive")

    const text_armor = element_unit
        .getElementsByClassName("armor")[0]
        .getElementsByClassName("value")[0]
        .innerText
        .trim()

    const int_count_models_attacking = get_int_count_models(element_unit_attacking)

    const text_strength = element_unit_attacking
        .getElementsByClassName("selected")[0]
        .getElementsByClassName("value")[0]
        .innerText
        .trim()

    const float_damage_per_model = Math.pow(
        2,
        parseInt(text_strength)
            - parseInt(text_armor))

    const text_damage_per_model = float_damage_per_model
        .toString()

    finish_action(
        text_other_side,
        "Attacked unit: "
            + element_unit
                .getElementsByClassName("name")[0]
                .textContent
                .trim()
            + "\n2^("
            + text_strength
            + "-"
            + text_armor
            + ") == "
            + text_damage_per_model
            + " damage per model\n"
            + int_count_models_attacking
                .toString()
            + " * "
            + text_damage_per_model
            + " == " 
            + (int_count_models_attacking
                * float_damage_per_model)
            + " damage total")

    hide_preview_attack()
    update_points_total(text_side)
}


function initialise() {

    update_points_total("left")
    update_points_total("right")
}

