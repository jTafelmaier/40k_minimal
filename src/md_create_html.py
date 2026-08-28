

import typing

from src import md_shared




def generate_htmls():

    list_dicts_factions = md_shared.get_dict_setting("data_factions.json") \
        ["data"]

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

            return "<div class=\"container_faction_button\" onclick=\"display_faction('" \
                + text_side \
                + "', '" \
                + name_faction \
                    .replace(
                        "'",
                        "\\'") \
                + "')\"><div class=\"image_faction\" style=\"background-image: url('" \
                + path_image_faction \
                + "')\"/><div>" \
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

                def get_text_html_attack(
                    pair_dict_attack:typing.Tuple[int, typing.Dict]):

                    int_index_attack, \
                    dict_attack = pair_dict_attack

                    return "<div class=\"model_action attack\" onclick=\"toggle_select_attack(" \
                        + text_parameters_functions \
                        + ", " \
                        + int_index_attack \
                            .__str__() \
                        + ")\"><div class=\"keywords\"><div class=\"range\">" \
                        + dict_attack \
                            ["range"] \
                        + " " \
                        + dict_attack \
                            ["restrictions"] \
                        + " " \
                        + dict_attack \
                            ["type"] \
                        + "</div></div><div class=\"value\">" \
                        + dict_attack \
                            ["damage"] \
                            .__str__() \
                        + "</div></div>"

                int_number_models_max = dict_unit \
                    ["number_models_max"]

                return "<div class=\"unit_faction unselected\" current_health=\"" \
                    + (int_number_models_max \
                        * dict_unit \
                            ["health_max"]) \
                        .__str__() \
                    + "\" requisition=\"" \
                    + dict_unit \
                        ["requisition"] \
                        .__str__() \
                    + "\"><div class=\"unit_state\" title=\"" \
                    + dict_unit \
                        ["requisition"] \
                        .__str__() \
                    + " requisition per model.\"><div class=\"models\">" \
                    +  "" \
                        .join(
                            map(
                                lambda int_index: "<div class=\"model\" onclick=\"set_count_models(" \
                                    + text_parameters_functions \
                                    + ", "
                                    + (int_index
                                       + 1)
                                        .__str__() \
                                    + ")\"/>",
                                range(int_number_models_max))) \
                    + "</div><div class=\"health_bar\" health_total=\"" \
                    + (int_number_models_max \
                        * dict_unit \
                            ["health_max"]) \
                        .__str__() \
                    + "\" onclick=\"apply_preview(" \
                    + text_parameters_functions \
                    + ")\"><div class=\"section difference\"></div><div class=\"section remaining\" style=\"height: 0%;\"></div></div></div><div class=\"image_unit\" onclick=\"toggle_count_models(" \
                    + text_parameters_functions \
                    + ", " \
                    + int_number_models_max \
                        .__str__() \
                    + ")\""\
                    + "style=\"background-image: url('" \
                    + "/" \
                        .join(
                            [
                                md_shared.get_text_path_images_faction(name_faction),
                                "units",
                                dict_unit \
                                    ["name"] \
                                    + ".png"]) \
                    + "')\"><div class=\"model_properties\"><div class=\"model_property health_max\"><div class=\"name\">HP</div><div class=\"value\">" \
                    + dict_unit \
                        ["health_max"] \
                        .__str__() \
                    + "</div></div><div class=\"model_property damage_reduction\"><div class=\"name\">DR</div><div class=\"value\">-" \
                    + dict_unit \
                        ["damage_reduction"] \
                        .__str__() \
                    + "</div></div><div class=\"name\">" \
                    + dict_unit \
                        ["name"] \
                    + "</div></div><div class=\"data_unit\"><div class=\"model_actions\"><div class=\"model_action movement\" onclick=\"set_inactive(" \
                    + text_parameters_functions \
                    + ")\"><div class=\"keywords\">move:</div><div class=\"value\">" \
                    + dict_unit \
                        ["move"] \
                    + "</div></div>" \
                    + "" \
                        .join(
                            map(
                                get_text_html_attack,
                                enumerate(
                                    dict_unit
                                        ["attacks"]))) \
                    + "</div></div></div></div>"

            return "<div class=\"faction invisible " \
                + name_faction \
                + "\"><div class=\"header_list\"><div class=\"image_faction\" style=\"background-image: url('" \
                + path_image_faction \
                + "')\"><div class=\"return_to_faction_selection\"><div class=\"interactive\" onclick=\"return_to_faction_selection('" \
                + text_side \
                + "')\">✖</div></div><div class=\"image_lower\"><div class=\"name\">" \
                + name_faction \
                    .upper() \
                + "</div></div></div></div><div class=\"units_faction\">" \
                + "" \
                    .join(
                        map(
                            get_text_html_unit,
                            enumerate(
                                dict_faction \
                                    ["units"]))) \
                + "</div></div>"

        return "<div id=\"" \
            + text_side \
            + "\"><div class=\"selection_factions\">Select a faction:<div>" \
            + "" \
                .join(
                    map(
                        get_text_html_button_show_faction,
                        list_dicts_factions)) \
            + "</div></div><div class=\"list_constructors\">" \
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
                + "<div id=\"match_state\"><div onclick=\"toggle_mode_list()\"><div id=\"start_match\">Start match</div><div id=\"turn_information\">turn<span id=\"turn_counter\">1</span></div><div id=\"requisition_total\"><div class=\"left\">0</div><div class=\"right\">0</div></div></div></div>"
                + get_text_html_faction_rules("right")
                + "</div>"))

    with open("index.html", mode="w", encoding="utf-8") as file_html:
        file_html \
            .write(
                soup_full \
                    .prettify())

    return None

