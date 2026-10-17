



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


function set_instance_state(
    element_unit_type,
    element_unit_instance,
    int_health_new) {

    const int_count_models = Math.ceil(
            int_health_new
                / get_int_unit_property(
                    element_unit_type,
                    "health_max"))

    const array_elements_models = Array.from(element_unit_instance
        .getElementsByClassName("models")[0]
        .children)

    array_elements_models
        .slice(0, int_count_models)
        .forEach(element => element.classList.add("alive"))

    array_elements_models
        .slice(int_count_models)
        .forEach(element => element.classList.remove("alive"))

    set_height_bar(
            element_unit_instance
                .getElementsByClassName("section remaining")[0],
            int_health_new)

    element_unit_instance
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


function get_element_unit_type(
    text_side,
    index_unit) {

    return document
        .getElementById(text_side)
        .querySelectorAll(".faction:not(.invisible)")[0]
        .getElementsByClassName("unit_type")[index_unit]
}


function get_int_count_models(
    element_unit_instance) {

    return element_unit_instance
        .getElementsByClassName("models")[0]
        .getElementsByClassName("alive")
        .length
}


function get_int_count_models_unit_type(
    element_unit_type) {

    return Array.from(element_unit_type
        .querySelectorAll(".unit_instance"))
        .map(get_int_count_models)
        .reduce((a, b) => a + b)
}


function update_requisition_total(
    text_side) {

    function get_int_requisition_unit_type(
        element_unit_type){

        return get_int_count_models_unit_type(element_unit_type)
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


function set_count_models(
    text_side,
    index_unit,
    text_id_instance,
    int_count_models) {

    const element_unit_type = get_element_unit_type(
            text_side,
            index_unit)

    const int_health_full = int_count_models
        * get_int_unit_property(
            element_unit_type,
            "health_max")

    const element_unit_instance = element_unit_type
        .querySelectorAll(".unit_instance.instance_" + text_id_instance)[0]

    element_unit_instance
        .getElementsByClassName("health_bar")[0]
        .setAttribute(
            "health_current",
            int_health_full
                .toString())

    set_instance_state(
            element_unit_type,
            element_unit_instance,
            int_health_full)

    if (int_count_models == 0) {
        if (get_int_count_models_unit_type(element_unit_type) == 0) {
            element_unit_type
                .classList
                .add("unpicked")
        }
        element_unit_instance
            .classList
            .add("unpicked")
    } else {
        element_unit_type
            .classList
            .remove("unpicked")
        element_unit_instance
            .classList
            .remove("unpicked")
    }

    update_requisition_total(text_side)
}


function toggle_count_models(
    text_side,
    index_unit,
    int_count_models_full) {

    if (document.getElementById("factions").classList.contains("match")) {
        return
    }

    const element_unit_type = get_element_unit_type(
            text_side,
            index_unit)

    const bool_already_picked = element_unit_type
        .getElementsByClassName("unit_instances")[0]
        .getElementsByClassName("alive")
        .length
        > 0

    // TODO simplify
    set_count_models(
            text_side,
            index_unit,
            "a",
            bool_already_picked ? 0 : int_count_models_full)

    set_count_models(
            text_side,
            index_unit,
            "b",
            0)

    set_count_models(
            text_side,
            index_unit,
            "c",
            0)
}


function test_new_turn() {

    const array_elements_unit_instances = Array.from(document
        .querySelectorAll(".unit_type:not(.unpicked) .unit_instance:not(.unpicked)"))

    if (!array_elements_unit_instances.every(element => element.classList.contains("already_activated")))
        return

    array_elements_unit_instances
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

    const classlist_factions = document.getElementById("factions").classList

    if ((!classlist_factions.contains("match")) || classlist_factions.contains("attack_in_progress")) {
        return
    }

    get_element_unit_type(
            text_side,
            index_unit)
        .querySelectorAll(".unit_instance.activated")[0]
        .classList
        .add("already_activated")

    test_new_turn()
}


function hide_preview_attack() {

    const element_army_lists = document
        .getElementById("factions")

    element_army_lists
        .classList
        .remove("attack_in_progress")

    function unset_attacked(
        element_unit_type) {

        Array.from(element_unit_type
            .querySelectorAll(".unit_instance:not(.unpicked)"))
            .forEach(element_unit_instance => set_instance_state(
                element_unit_type,
                element_unit_instance,
                get_int_attribute(
                    element_unit_instance
                        .getElementsByClassName("health_bar")[0],
                    "health_current")))

        element_unit_type
            .classList
            .remove("attacked")
    }

    Array.from(element_army_lists
        .getElementsByClassName("attacked"))
        .forEach(unset_attacked)

    Array.from(element_army_lists
        .querySelectorAll(".unit_type.activated .highlighted"))
        .forEach(element => element.classList.remove("highlighted"))
}


function click_on_instance(
    text_side,
    index_unit,
    text_id_instance) {

    if (!document.getElementById("factions").classList.contains("match")) {
        return
    }

    const element_unit_type = get_element_unit_type(
            text_side,
            index_unit)

    const element_unit_instance = element_unit_type
        .querySelectorAll(".unit_instance.instance_" + text_id_instance)[0]

    function apply_preview() {

        const int_health_points_new = get_int_attribute(
                element_unit_instance
                    .getElementsByClassName("health_bar")[0],
                "health_current")
            - get_int_attribute(
                element_unit_instance
                    .getElementsByClassName("section difference")[0],
                "value")

        set_height_bar(
                element_unit_instance
                    .getElementsByClassName("section difference")[0],
                0)

        set_instance_state(
                element_unit_type,
                element_unit_instance,
                int_health_points_new)

        // TODO simplify
        if (int_health_points_new <= 0) {
            if (get_int_count_models_unit_type(element_unit_type) == 0) {
                element_unit_type
                    .classList
                    .add("unpicked")
            }
            element_unit_instance
                .classList
                .add("unpicked")
        }

        element_unit_instance
            .getElementsByClassName("health_bar")[0]
            .setAttribute(
                "health_current",
                int_health_points_new
                    .toString())

        const element_unit_type_attacking = document
            .querySelectorAll("#factions .unit_type.activated")[0]

        const element_unit_instance_attacking = element_unit_type_attacking
            .querySelectorAll(".unit_instance.activated")[0]

        element_unit_instance_attacking
            .classList
            .add("already_activated")

        element_unit_type_attacking
            .parentElement
            .classList
            .remove("activated_side")

        element_unit_type_attacking
            .classList
            .remove("activated")

        element_unit_instance_attacking
            .classList
            .remove("activated")

        update_requisition_total(text_side)

        hide_preview_attack()

        test_new_turn()
    }

    function activate_instance() {

        if (element_unit_instance.classList.contains("already_activated")) {
            return
        }

        Array.from(document
            .querySelectorAll("#factions .activated_side"))
            .forEach(element => element.classList.remove("activated_side"))

        Array.from(document
            .querySelectorAll("#factions .unit_type.activated"))
            .forEach(element => element.classList.remove("activated"))

        Array.from(document
            .querySelectorAll("#factions .unit_instance.activated"))
            .forEach(element => element.classList.remove("activated"))

        document
            .getElementById("factions")
            .classList
            .add("attack_in_progress")

        element_unit_type
            .parentElement
            .classList
            .add("activated_side")

        element_unit_type
            .classList
            .add("activated")

        element_unit_instance
            .classList
            .add("activated")
    }

    if (element_unit_type.classList.contains("attacked")) {
        apply_preview()
    } else {
        activate_instance()
    }
}


function toggle_attack(
    text_side_unit_attacking,
    index_unit_attacking,
    index_attack) {

    if (!document.getElementById("factions").classList.contains("match")) {
        return
    }

    const element_unit_type_attacking = get_element_unit_type(
            text_side_unit_attacking,
            index_unit_attacking)

    if (!element_unit_type_attacking.classList.contains("activated")) {
        return
    }

    const element_unit_instance_attacking = element_unit_type_attacking
        .querySelectorAll(".unit_instance.activated")[0]

    const element_attack = element_unit_type_attacking
        .getElementsByClassName("attack")[index_attack]

    const bool_currently_highlighted = element_attack
        .classList
        .contains("highlighted")

    hide_preview_attack()

    if (bool_currently_highlighted) {
        return
    }

    function show_preview_attack(
        element_unit_type_attacked) {

        const text_keywords_attack = element_attack
            .getElementsByClassName("keywords")[0]
            .innerText
            .trim()

        function show_preview_damage_instance(
            element_unit_instance_attacked) {

            function get_int_damage_consider_volume() {

                const int_strength = parseInt(element_attack
                    .getElementsByClassName("value")[0]
                    .innerText
                    .trim())

                if ((text_keywords_attack.includes("volume") || text_keywords_attack.includes("blast")) && get_int_count_models(element_unit_instance_attacked) > 1) {
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
                                element_unit_type_attacked,
                                "damage_reduction"))

                if (text_keywords_attack.includes("single")) {
                    return Math.min(
                            int_damage,
                            get_int_unit_property(
                                element_unit_type_attacked,
                                "health_max"))
                } else {
                    return int_damage
                }
            }

            const int_health_current = get_int_attribute(
                    element_unit_instance_attacked
                        .getElementsByClassName("health_bar")[0],
                    "health_current")

            const int_damage_added = Math.min(
                    int_health_current,
                    get_int_damage_per_attack()
                        * get_int_count_models(element_unit_instance_attacking))

            set_height_bar(
                    element_unit_instance_attacked
                        .getElementsByClassName("section difference")[0],
                    int_damage_added)

            set_instance_state(
                    element_unit_type_attacked,
                    element_unit_instance_attacked,
                    int_health_current
                        - int_damage_added)
        }

        Array.from(element_unit_type_attacked
            .querySelectorAll(".unit_instance:not(.unpicked)"))
            .forEach(show_preview_damage_instance)

        element_unit_type_attacked
            .classList
            .add("attacked")
    }

    Array.from(element_unit_type_attacking
        .querySelectorAll(".highlighted"))
        .forEach(element => element.classList.remove("highlighted"))

    element_attack
        .classList
        .add("highlighted")

    Array.from(document
        .getElementById(text_side_unit_attacking === "left" ? "right" : "left")
        .querySelectorAll(".faction:not(.invisible)")[0]
        .querySelectorAll(".unit_type:not(.unpicked)"))
        .forEach(show_preview_attack)
}

