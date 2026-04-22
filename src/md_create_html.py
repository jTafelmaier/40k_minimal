

import typing

from src import md_shared




def generate_htmls():

    list_dicts_factions = md_shared.get_dict_setting("data_factions.json") \
        ["data"]

    # TODO integrate
    def get_text_html_data_unit(
        dict_unit:typing.Dict,
        name_faction:str,
        text_side:str,
        int_index_unit:int = 0):

        text_parameters_functions = "'" \
            + text_side \
            + "', " \
            + int_index_unit \
                .__str__()

        def get_text_html_attack(
            pair_dict_attack:typing.Tuple[int, typing.Dict]):

            int_index_attack, \
            dict_attack = pair_dict_attack

            return "<div class=\"model_property attack\" onclick=\"toggle_select_attack(" \
                + text_parameters_functions \
                + ", " \
                + int_index_attack \
                    .__str__() \
                + ")\"><div class=\"icon\">" \
                + dict_attack \
                    ["range"] \
                + "</div><div class=\"skillbar\"><div style=\"width: " \
                +  (dict_attack \
                        ["strength"]
                        * 8) \
                    .__str__() \
                + "px;\"/></div><div class=\"value\">" \
                + dict_attack \
                    ["strength"] \
                    .__str__() \
                + "</div><div class=\"type\">" \
                + dict_attack \
                    ["type"] \
                + (" heavy" if dict_attack["heavy"] else "") \
                + "</div></div>"

        path_image_unit = "/" \
            .join(
                [
                    md_shared.get_text_path_images_faction(name_faction),
                    "units",
                    dict_unit \
                        ["name"] \
                        + ".png"])

        text_html_rows_attacks = "" \
            .join(
                map(
                    get_text_html_attack,
                    enumerate(
                        dict_unit
                            ["attacks"])))

        return "<div class=\"model\" title=\"[" \
            + dict_unit["type_unit"] \
            + "], " \
            + dict_unit \
                ["points_per_model"] \
                .__str__() \
            + " points per model.\"><div class=\"image_unit\" style=\"background-image: url('" \
            + path_image_unit \
            + "')\"><div class=\"data_unit\"><div class=\"model_property name\">" \
            + dict_unit \
                ["name"] \
            + "</div><div class=\"model_property armor\"><div class=\"icon\">⛊</div><div class=\"skillbar\"><div style=\"width: " \
            +  (dict_unit \
                    ["armor"]
                    * 8) \
                .__str__() \
            + "px;\"/></div><div class=\"value\">" \
            + dict_unit \
                ["armor"] \
                .__str__() \
            + "</div><div class=\"type\">" \
            + dict_unit \
                ["type_armor"] \
            + "</div></div><div class=\"model_property movement\" onclick=\"set_inactive(" \
            + text_parameters_functions \
            + ")\"><div class=\"icon\">🡆</div><div class=\"skillbar\"><div style=\"width: " \
            +  (dict_unit \
                    ["move"]
                    * 1.5) \
                .__str__() \
            + "px;\"/></div><div class=\"value\">" \
            + dict_unit \
                ["move"] \
                .__str__() \
            + "</div></div>" \
            + text_html_rows_attacks \
            + "</div></div></div>"

    def get_text_html_faction_rules(
        text_side):

        def get_text_html_button_show_faction(
            dict_faction:typing.Dict):

            name_faction = dict_faction \
                ["name"]

            path_image_faction = "/" \
                .join(
                    [
                        md_shared.get_text_path_images_faction(name_faction),
                        "faction.png"])

            return "<div class=\"container_faction_button\"><div class=\"image_faction preview_faction_button\" onclick=\"display_faction('" \
                + text_side \
                + "', '" \
                + name_faction \
                    .replace(
                        "'",
                        "\\'") \
                + "')\" style=\"background-image: url('" \
                + path_image_faction \
                + "')\">" \
                + name_faction \
                + "</div></div>"

        def get_html_list_constructor(
            dict_faction:typing.Dict):

            name_faction = dict_faction \
                ["name"]

            path_image_faction = "/" \
                .join(
                    [
                        md_shared.get_text_path_images_faction(name_faction),
                        "faction.png"])

            def get_text_html_unit(
                pair_dict_unit:typing.Tuple[int, typing.Dict]):

                int_index_unit, \
                dict_unit = pair_dict_unit

                text_parameters_functions = "'" \
                    + text_side \
                    + "', " \
                    + int_index_unit \
                        .__str__()

                return "<div class=\"unit_faction unselected\" initial_health=\"0\" current_health=\"0\"><div class=\"unit_count_modifier\"><div class=\"modify_count\" onclick=\"modify_count_models('" \
                    + text_side \
                    + "', " \
                    + int_index_unit \
                        .__str__() \
                    + ", +5)\">+5</div><div class=\"modify_count\" onclick=\"modify_count_models('" \
                    + text_side \
                    + "', " \
                    + int_index_unit \
                        .__str__() \
                    + ", 1)\">+1</div><div class=\"count_models\">0</div><div class=\"modify_count\" onclick=\"modify_count_models('" \
                    + text_side \
                    + "', " \
                    + int_index_unit \
                        .__str__() \
                    + ", -1)\">-1</div><div class=\"modify_count\" onclick=\"modify_count_models('" \
                    + text_side \
                    + "', " \
                    + int_index_unit \
                        .__str__() \
                    + ", -5)\">-5</div></div><div class=\"unit_state\"><div class=\"coordinates\"><div class=\"coordinate remaining\" style=\"height: 100%;\" onmouseenter=\"mouseenter_attack(" \
                    + text_parameters_functions \
                    + ")\" onmouseleave=\"mouseleave_attack(" \
                    + text_parameters_functions \
                    + ")\" onclick=\"apply_preview(" \
                    + text_parameters_functions \
                    + ")\">0.00</div></div><div class=\"health_bar\"><div class=\"section difference\"></div><div class=\"section remaining\" style=\"height: 100%;\"></div></div></div>" \
                    + get_text_html_data_unit(
                        dict_unit=dict_unit,
                        name_faction=name_faction,
                        text_side=text_side,
                        int_index_unit=int_index_unit) \
                    + "</div>"

            return "<div class=\"faction constructor invisible " \
                + name_faction \
                + "\"><div class=\"header_list\"><div class=\"image_faction\" style=\"background-image: url('" \
                + path_image_faction \
                + "')\"><div class=\"image_lower\"><div class=\"name\">" \
                + name_faction \
                + "</div><div class=\"interactive toggle_mode_list\" onclick=\"toggle_mode_list('" \
                + text_side \
                + "')\">switch mode</div><div class=\"interactive return_to_faction_selection\" onclick=\"return_to_faction_selection('" \
                + text_side \
                + "')\">✖</div></div></div><div class=\"points_total\">0 points</div></div><div class=\"units_faction\">" \
                + "" \
                    .join(
                        map(
                            get_text_html_unit,
                            enumerate(
                                dict_faction \
                                    ["units"]))) \
                + "</div></div>"

        # TODO refactor
        return "<div id=\"" \
            + text_side \
            + "\"><div class=\"selection_factions\">" \
            + "" \
                .join(
                    map(
                        get_text_html_button_show_faction,
                        list_dicts_factions)) \
            + "</div><div class=\"list_constructors\">" \
            + "" \
                .join(
                    map(
                        get_html_list_constructor,
                        list_dicts_factions)) \
            + "</div></div>"

    soup_full = md_shared.get_soup(
        md_shared.get_text_file(
            [
                "src",
                "data",
                "template_index.html"]))

    soup_full \
        .find(
            name="placeholder",
            id="id_factions") \
        .replace_with(
            md_shared.get_soup("<div class=\"army_constructors\">"
                + get_text_html_faction_rules("left")
                + get_text_html_faction_rules("right")
                + "</div>"))

    with open("index.html", mode="w", encoding="utf-8") as file_html:
        file_html \
            .write(
                soup_full \
                    .prettify())

    return None

