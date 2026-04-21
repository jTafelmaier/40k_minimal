

import json
import os
import typing

from src import md_shared




def main():

    def modify_faction(
        dict_faction:typing.Dict):

        def re_add_property(
            dictionary:typing.Dict,
            name_property:str):

            t = dictionary[name_property]

            del dictionary[name_property]

            dictionary[name_property] = t

        def modify_unit(
            dict_unit:typing.Dict):

            def modify_attack(
                dict_attack:typing.Dict):

                return None

            list(
                    map(
                        modify_attack,
                        dict_unit \
                            ["attacks"]))

            return None

        list(
                map(
                    modify_unit,
                    dict_faction \
                        ["units"]))

    list_texts_path = [
        "src",
        "data",
        "data_factions.json"]

    dict_factions = md_shared.get_dict_json(list_texts_path)

    for dict_faction in dict_factions["data"]:
        modify_faction(dict_faction)

    with open(os.path.join(*list_texts_path), mode="w", encoding="utf-8") as file:
        file \
            .write(
                json.dumps(
                    obj=dict_factions,
                    indent=4,
                    ensure_ascii=False))

    return None


if __name__ ==  "__main__":
    main()

