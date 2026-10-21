



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
            .querySelectorAll(".value")[0]
            .innerText
            .trim())
}


function display_faction(
    text_side,
    name_faction){

    document
        .getElementById(text_side)
        .querySelectorAll(".selection_factions")[0]
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
        .querySelectorAll(".selection_factions")[0]
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


function show_instance_state(
    element_unit_type,
    element_unit_instance,
    int_health_new) {

    const int_count_models = Math.ceil(
            int_health_new
                / get_int_unit_property(
                    element_unit_type,
                    "health_max"))

    const array_elements_models = Array.from(element_unit_instance
        .querySelectorAll(".models")[0]
        .children)

    array_elements_models
        .slice(0, int_count_models)
        .forEach(element => element.classList.add("alive"))

    array_elements_models
        .slice(int_count_models)
        .forEach(element => element.classList.remove("alive"))

    set_height_bar(
            element_unit_instance
                .querySelectorAll(".section.remaining")[0],
            int_health_new)

    element_unit_instance
        .querySelectorAll(".health_bar")[0]
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
        .querySelectorAll("#" + text_side + " .faction:not(.invisible) .unit_type")[index_unit]
}


function get_int_count_models(
    element_unit_instance) {

    return element_unit_instance
        .querySelectorAll(".models .alive")
        .length
}


function get_int_count_models_unit_type(
    element_unit_type) {

    return Array.from(element_unit_type
        .querySelectorAll(".unit_instance:not(.unpicked)"))
        .map(get_int_count_models)
        .reduce(
            (a, b) => a + b,
            0)
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
            .querySelectorAll(".faction:not(.invisible) .unit_type:not(.unpicked)"))
            .map(get_int_requisition_unit_type)
            .reduce(
                (a, b) => a + b,
                0)
            .toString()
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


function set_active_instance_inactive() {

    const classlist_factions = document
        .getElementById("factions")
        .classList

    if ((!classlist_factions.contains("match")) || classlist_factions.contains("attack_in_progress")) {
        return
    }

    const element_unit_type = document
        .querySelectorAll(".army_constructors .unit_type.activated")[0]

    const element_unit_instance = element_unit_type
        .querySelectorAll(".unit_instance.activated")[0]

    element_unit_instance
        .classList
        .add("already_activated")

    element_unit_instance
        .classList
        .remove("activated")

    element_unit_type
        .parentElement
        .classList
        .remove("activated_side")

    element_unit_type
        .classList
        .remove("activated")

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
            .forEach(element_unit_instance => show_instance_state(
                element_unit_type,
                element_unit_instance,
                get_int_attribute(
                    element_unit_instance,
                    "health_current")))

        element_unit_type
            .classList
            .remove("attacked")
    }

    Array.from(element_army_lists
        .querySelectorAll(".attacked"))
        .forEach(unset_attacked)

    Array.from(element_army_lists
        .querySelectorAll(".unit_type.activated .highlighted"))
        .forEach(element => element.classList.remove("highlighted"))
}


function click_on_instance(
    text_side,
    index_unit,
    text_id_instance) {

    const element_unit_type = get_element_unit_type(
            text_side,
            index_unit)

    const element_unit_instance = element_unit_type
        .querySelectorAll(".unit_instance.instance_" + text_id_instance)[0]

    function toggle_instance() {

        const element_unit_instance = element_unit_type
            .querySelectorAll(".unit_instance.instance_" + text_id_instance)[0]

        const int_count_models_alive = get_int_count_models(element_unit_instance)

        const int_count_models_new = int_count_models_alive > 0 ? 0 : element_unit_instance
            .querySelectorAll(".model")
            .length

        const int_health_new = int_count_models_new
            * get_int_unit_property(
                    element_unit_type,
                    "health_max")

        element_unit_instance
            .setAttribute(
                "health_current",
                int_health_new
                    .toString())

        show_instance_state(
                element_unit_type,
                element_unit_instance,
                int_health_new)

        if (int_count_models_new == 0) {
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

    function apply_preview() {

        const int_health_points_new = get_int_attribute(
                element_unit_instance,
                "health_current")
            - get_int_attribute(
                element_unit_instance
                    .querySelectorAll(".section.difference")[0],
                "value")

        set_height_bar(
                element_unit_instance
                    .querySelectorAll(".section.difference")[0],
                0)

        hide_preview_attack()

        show_instance_state(
                element_unit_type,
                element_unit_instance,
                int_health_points_new)

        element_unit_instance
            .setAttribute(
                "health_current",
                int_health_points_new
                    .toString())

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

        set_active_instance_inactive()

        update_requisition_total(text_side)
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

    if (!document.getElementById("factions").classList.contains("match")) {
        toggle_instance()
    } else if (element_unit_type.classList.contains("attacked")) {
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
        .querySelectorAll(".attack")[index_attack]

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
            .querySelectorAll(".keywords")[0]
            .innerText
            .trim()

        function show_preview_damage_instance(
            element_unit_instance_attacked) {

            function get_int_damage_consider_volume() {

                const int_strength = parseInt(element_attack
                    .querySelectorAll(".value")[0]
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
                    element_unit_instance_attacked,
                    "health_current")

            const int_damage_added = Math.min(
                    int_health_current,
                    get_int_damage_per_attack()
                        * get_int_count_models(element_unit_instance_attacking))

            set_height_bar(
                    element_unit_instance_attacked
                        .querySelectorAll(".section.difference")[0],
                    int_damage_added)

            show_instance_state(
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

    document
        .getElementById("factions")
        .classList
        .add("attack_in_progress")

    Array.from(element_unit_type_attacking
        .querySelectorAll(".highlighted"))
        .forEach(element => element.classList.remove("highlighted"))

    element_attack
        .classList
        .add("highlighted")

    Array.from(document
        .getElementById(text_side_unit_attacking === "left" ? "right" : "left")
        .querySelectorAll(".faction:not(.invisible) .unit_type:not(.unpicked)"))
        .forEach(show_preview_attack)
}

