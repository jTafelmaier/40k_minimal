

import typing

from src import md_shared




def generate_htmls():

    list_dicts_factions = md_shared.get_dict_setting("data_factions.json") \
        ["data"]

    def get_text_html_data_unit(
        dict_unit:typing.Dict,
        name_faction:str,
        text_side:str = "left",
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
            + "] " \
            + dict_unit \
                ["name"] \
            + ":\n" \
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

    def get_text_html_faction_rules():

        def get_text_html_button_show_faction(
            dict_faction:typing.Dict):

            name_faction = dict_faction \
                ["name"]

            path_image_faction = "/" \
                .join(
                    [
                        md_shared.get_text_path_images_faction(name_faction),
                        "faction.png"])

            return "<div class=\"container_faction_button " \
                + name_faction \
                + "\"><a class=\"image_faction preview_faction_button\" href=\"index_" \
                + name_faction \
                + ".html\" style=\"background-image: url('" \
                + path_image_faction \
                + "')\">" \
                + name_faction \
                + "</a></div>"

        def create_html_faction(
            dict_faction:typing.Dict):

            name_faction = dict_faction \
                ["name"]

            def get_text_html_unit(
                dict_unit:typing.Dict):

                return "<div class=\"unit_faction\">" \
                    + get_text_html_data_unit(
                        dict_unit=dict_unit,
                        name_faction=name_faction) \
                    + "</div>"

            text_html_faction = "" \
                .join(
                    map(
                        get_text_html_unit,
                        dict_faction \
                            ["units"]))

            text_html = "<div class=\"faction_rules " \
                + name_faction \
                + "\">" \
                + text_html_faction \
                + "</div>"

            soup_faction = md_shared.get_soup(text_html)

            text_html_template = md_shared.get_text_file(
                [
                    "src",
                    "data",
                    "template_faction.html"])

            soup_full = md_shared.get_soup(text_html_template)

            soup_full \
                .find(
                    name="placeholder",
                    id="id_faction") \
                .replace_with(soup_faction)

            with open("index_" + name_faction + ".html", mode="w", encoding="utf-8") as file_html:
                file_html \
                    .write(
                        soup_full \
                            .prettify())

            return

        # TODO refactor
        list(
            map(
                create_html_faction,
                list_dicts_factions))

        return "<div class=\"selection_factions\">" \
            + "" \
                .join(
                    map(
                        get_text_html_button_show_faction,
                        list_dicts_factions)) \
            + "</div>"

    def get_text_html_army_lists():

        dict_army_lists = md_shared.get_dict_setting("army_lists.json")

        def get_html_army_list(
            text_side:str):

            dict_army_list = dict_army_lists \
                [text_side]

            name_faction = dict_army_list \
                ["faction"]

            dict_faction = next(
                    filter(
                        lambda dict_faction: dict_faction["name"] == name_faction,
                        list_dicts_factions))

            dict_units = dict(
                    map(
                        lambda dict_unit: (
                            dict_unit \
                                ["name"],
                            dict_unit),
                        dict_faction \
                            ["units"]))

            def get_text_html_unit(
                pair_dict_unit_army_list:typing.Tuple[int, typing.Dict]):

                int_index_unit, \
                dict_unit_army_list = pair_dict_unit_army_list

                dict_unit = dict_units \
                    [
                        dict_unit_army_list \
                            ["name"]]

                text_parameters_functions = "'" \
                    + text_side \
                    + "', " \
                    + int_index_unit \
                        .__str__()

                int_count_models = dict_unit_army_list \
                    ["count_models"]

                int_limit = {
                    "C": 1,
                    "E": 10,
                    "H": 20} \
                    [dict_unit["type_unit"]]

                assert int_count_models <= int_limit

                text_health_points_initial = (int_count_models 
                    * 100) \
                    .__str__()

                return "<div class=\"unit_army_list\" initial_health=\"" \
                    + text_health_points_initial \
                    + "\" current_health=\"" \
                    + text_health_points_initial \
                    + "\"><div class=\"unit_state\"><div class=\"coordinates\"><div class=\"coordinate difference no_cover\" onclick=\"apply_preview(" \
                    + text_parameters_functions \
                    + ", true)\" onmouseenter=\"mouseenter_in_cover(" \
                    + text_parameters_functions \
                    + ")\" onmouseleave=\"mouseleave_in_cover(" \
                    + text_parameters_functions \
                    + ")\"></div><div class=\"coordinate remaining\" style=\"height: 100%;\" onmouseenter=\"mouseenter_no_cover(" \
                    + text_parameters_functions \
                    + ")\" onmouseleave=\"mouseleave_no_cover(" \
                    + text_parameters_functions \
                    + ")\" onclick=\"apply_preview(" \
                    + text_parameters_functions \
                    + ", false)\">" \
                    + int_count_models \
                        .__str__() \
                    + "</div></div><div class=\"health_bar\"><div class=\"section difference in_cover\"></div><div class=\"section difference no_cover\"></div><div class=\"section remaining\" style=\"height: 100%;\"></div></div></div>" \
                    + get_text_html_data_unit(
                        dict_unit=dict_unit,
                        name_faction=name_faction,
                        text_side=text_side,
                        int_index_unit=int_index_unit) \
                    + "</div>"

            path_image_faction = "/" \
                .join(
                    [
                        md_shared.get_text_path_images_faction(name_faction),
                        "faction.png"])

            return "<div><div id=\"" \
                + text_side \
                + "\" class=\"army_list\"><div class=\"header_list\"><div class=\"image_faction\" style=\"background-image: url('" \
                + path_image_faction \
                + "')\"></div><div class=\"match_data\"><div class=\"summary\">" \
                + "<br/>" \
                    .join(
                        map(
                            lambda dict_unit: "<div class=\"points_unit\">"
                                + (dict_unit["count_models"]
                                    * dict_units
                                        [dict_unit["name"]]
                                        ["points_per_model"])
                                    .__str__()
                                + "pts: </div>"
                                + dict_unit["count_models"]
                                    .__str__()
                                + "x "
                                + dict_unit["name"],
                            dict_army_list \
                                ["units"])) \
                + "</div><div class=\"points_total\"></div></div></div>" \
                + "" \
                    .join(
                        map(
                            get_text_html_unit,
                            enumerate(
                                dict_army_list \
                                    ["units"]))) \
                + "</div></div>"

        return get_html_army_list("left") \
            + get_html_army_list("right")

    text_html_template = md_shared.get_text_file(
        [
            "src",
            "data",
            "template_index.html"])

    soup_full = md_shared.get_soup(text_html_template)

    dict_replacements = {
        "id_factions": md_shared.get_soup(get_text_html_faction_rules()),
        "id_army_lists": md_shared.get_soup(get_text_html_army_lists())}

    for id_placeholder, soup_replacement in dict_replacements.items():
        soup_full \
            .find(
                name="placeholder",
                id=id_placeholder) \
            .replace_with(soup_replacement)

    with open("index.html", mode="w", encoding="utf-8") as file_html:
        file_html \
            .write(
                soup_full \
                    .prettify())

    return None

