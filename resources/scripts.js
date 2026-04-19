



function get_int_attribute(
    element,
    text_attribute) {

    return parseInt(
            element
                .getAttribute(text_attribute))
}


function mouseenter_in_cover(
    text_side,
    index_unit) {

    get_element_unit_army_list(
            text_side,
            index_unit)
        .getElementsByClassName("section in_cover")[0]
        .classList
        .add("invisible")
}


function mouseleave_in_cover(
    text_side,
    index_unit) {

    get_element_unit_army_list(
            text_side,
            index_unit)
        .getElementsByClassName("section in_cover")[0]
        .classList
        .remove("invisible")
}


function mouseenter_no_cover(
    text_side,
    index_unit) {

    mouseenter_in_cover(
            text_side,
            index_unit)

    get_element_unit_army_list(
            text_side,
            index_unit)
        .getElementsByClassName("section no_cover")[0]
        .classList
        .add("invisible")
}


function mouseleave_no_cover(
    text_side,
    index_unit) {

    mouseleave_in_cover(
            text_side,
            index_unit)

    get_element_unit_army_list(
            text_side,
            index_unit)
        .getElementsByClassName("section no_cover")[0]
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
        return;

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

    if (document.getElementById("army_lists").classList.contains("attack_in_progress")) return;

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


const INT_HEALTH_POINTS = 100


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
                    .split("\n")
                    .at(1)
                    .split(" ")
                    .at(0))
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
            .toString()
            .replace(
                "0.",
                ".")
}


function hide_preview_attack() {

    const element_army_lists = document
        .getElementById("army_lists")

    if (!element_army_lists.classList.contains("attack_in_progress")) {
        return;
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

        function get_int_damage_apply_type_armor(
            int_damage) {

            if (text_type_armor === "shielded") return Math.max(
                    0,
                    int_damage - Math.floor(INT_HEALTH_POINTS * 0.25))
            else if (text_type_armor === "stealth" && bool_in_cover) return 0
            else return int_damage
        }

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

        function get_int_damage_added(
            bool_in_cover){

            return Math.min(
                    int_health_current,
                    get_int_damage_single(
                        get_int_damage_apply_type_armor(
                            Math.floor(
                                INT_HEALTH_POINTS
                                    * int_count_models_attacking
                                    * Math.pow(
                                        2,
                                        int_strength
                                            - int_armor
                                            - (bool_in_cover ? 1 : 0)
                                            - (text_type_attack.includes("volume") && get_int_count_models(element_unit_attacked) === 1 ? 1 : 0))))))
        }

        const int_damage_added_in_cover = get_int_damage_added(true)

        const int_damage_added_no_cover = get_int_damage_added(false)

        const element_difference_in_cover = element_unit_attacked
            .getElementsByClassName("section in_cover")[0]

        const element_difference_no_cover = element_unit_attacked
            .getElementsByClassName("section no_cover")[0]

        if (int_damage_added_in_cover === int_damage_added_no_cover) {
            element_difference_no_cover
                .classList
                .add("invisible")
        } else {
            element_difference_no_cover
                .classList
                .remove("invisible")
        }

        set_height_bar(
                element_difference_in_cover,
                int_damage_added_in_cover,
                int_health_initial)

        set_height_bar(
                element_difference_no_cover,
                int_damage_added_no_cover
                    - int_damage_added_in_cover,
                int_health_initial)

        set_height_bar(
                element_unit_attacked
                    .getElementsByClassName("coordinate no_cover")[0],
                int_damage_added_no_cover
                    - int_damage_added_in_cover,
                int_health_initial)

        set_text_bar(
                element_unit_attacked
                    .getElementsByClassName("coordinate no_cover")[0],
                int_health_current
                    - int_damage_added_in_cover)

        set_height_bar(
                element_unit_attacked
                    .getElementsByClassName("section remaining")[0],
                int_health_current
                    - int_damage_added_no_cover,
                int_health_initial)

        set_height_bar(
                element_unit_attacked
                    .getElementsByClassName("coordinate remaining")[0],
                int_health_current
                    - int_damage_added_no_cover,
                int_health_initial)

        set_text_bar(
                element_unit_attacked
                    .getElementsByClassName("coordinate remaining")[0],
                int_health_current
                    - int_damage_added_no_cover)

        element_unit_attacked
            .classList
            .add("attacked")
    }

    const bool_already_selected = element_attack
        .classList
        .contains("selected")

    hide_preview_attack()

    if (bool_already_selected) {
        return;
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
    index_unit,
    bool_in_cover) {

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
                .getElementsByClassName("section in_cover")[0],
            "value")
        - (bool_in_cover ? 0 : get_int_attribute(
            element_unit
                .getElementsByClassName("section no_cover")[0],
            "value"))

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

