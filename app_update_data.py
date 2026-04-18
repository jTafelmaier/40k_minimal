

import json
import os
import typing

from lib.unary import _dicts
from lib.unary import _iters
from lib.unary.main import unary

from src import md_shared




def main():

    def re_add_property(
        dictionary:typing.Dict,
        name_property:str):

        t = dictionary[name_property]

        del dictionary[name_property]

        dictionary[name_property] = t

    def modify_data(
        dict_factions:typing.Dict):

        @unary()
        def modify_faction(
            dict_faction:typing.Dict):

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

            return None

        dict_factions \
            >> _dicts.to_iterable_values() \
            >> _iters.to_iterable_chained() \
            >> _iters.to_iterable_for_each_eager(modify_faction)

        return None

    dict_factions = md_shared.get_dict_setting("data_factions.json")

    modify_data(dict_factions)

    path_data = os.path.join(
            "src",
            "data",
            "data_factions.json")

    text_json = json.dumps(
            obj=dict_factions,
            indent=4,
            ensure_ascii=False)

    with open(path_data, mode="w", encoding="utf-8") as file:
        file \
            .write(text_json)

    return None


if __name__ ==  "__main__":
    main()

