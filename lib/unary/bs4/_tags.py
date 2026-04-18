

import typing

import bs4

from lib.unary import _dicts
from lib.unary import _items
from lib.unary import _iters
from lib.unary import _texts
from lib.unary.bs4 import _tags
from lib.unary.main import Function_unary
from lib.unary.main import unary




ALIAS_ATTR_ID = "id"
ALIAS_ATTR_CLASS = "class"
ALIAS_ATTR_TYPE = "type"



# TODO test further
def to_html():

    """
    :return: the tag as text (String) in HTML format
    """

    @unary()
    def inner(
        tag:bs4.element.Tag):

        return tag \
            .__str__()

    return inner


def to_inner_html():

    """
    :return: the innerHtml of the tag as string
    """

    @unary()
    def inner(
        tag:bs4.element.Tag):

        return tag \
            .encode_contents() \
            .decode('utf-8')

    return inner


def to_tag_child(
    name:str,
    bool_search_recursive:bool = False,
    dict_attributes:typing.Dict[str, str] = {}):

    """
    :return: a tag that is contained in (a child of) the current tag.
    :argument "name": returned tag must have "name" as tag name
    :argument "dict_attributes": returned tag must have attributes present in "dict_attributes"
    :argument "bool_search_recursive" if True, searches recursively, that is, the returned tag does not need to be a direct child of the current tag.
    """

    @unary()
    def inner(
        tag:bs4.element.Tag):

        assert isinstance(tag, bs4.element.Tag)

        return tag \
            .find(
                name=name,
                recursive=bool_search_recursive,
                attrs=dict_attributes)

    return inner


# TODO test further
def to_tag_parent(
    name:str,
    bool_search_recursive:bool = False,
    dict_attributes:typing.Dict[str, str] = {}):

    """
    :return: a tag that is a parent of the current tag.
    :argument "name": returned tag must have "name" as tag name
    :argument "dict_attributes": returned tag must have attributes present in "dict_attributes"
    :argument "bool_search_recursive" currently unused
    """

    # TODO use bool_search_recursive

    @unary()
    def inner(
        tag:bs4.element.Tag):

        return tag \
            .find_parent(
                name=name,
                attrs=dict_attributes)

    return inner


def to_list_tags_children(
    name:str,
    bool_search_recursive:bool = False,
    dict_attributes:typing.Dict[str, str] = {}):

    """
    :return: a list of tags that are contained in (are children of) the current tag.
    :argument "name": returned tags must have "name" as tag name
    :argument "dict_attributes": returned tags must have attributes present in "dict_attributes"
    :argument "bool_search_recursive" if True, searches recursively, that is, the returned tags do not need to be direct children of the current tag.
    # NOTE WARNING: it is possible to pass a list of strings to "name". If this list is empty, all tags will be matched!!
    """

    @unary()
    def inner(
        tag:bs4.element.Tag):

        return tag \
            .find_all(
                name=name,
                recursive=bool_search_recursive,
                attrs=dict_attributes)

    return inner


# TODO test further
def to_list_tags_siblings_next(
    name:str,
    dict_attributes:typing.Dict[str, str] = {}):

    @unary()
    def inner(
        tag:bs4.element.Tag):

        return tag \
            .find_next_siblings(
                name=name,
                attrs=dict_attributes)

    return inner


# TODO test further
def to_navigable_string_child(
    bool_search_recursive:bool = False):

    @unary()
    def inner(
        tag:bs4.element.Tag):

        return tag \
            .find(
                text=True,
                recursive=bool_search_recursive)

    return inner


# TODO test further
def to_list_navigable_strings_children(
    bool_search_recursive:bool = False):

    @unary()
    def inner(
        tag:bs4.element.Tag):

        return tag \
            .find_all(
                text=True,
                recursive=bool_search_recursive)

    return inner


def to_text_content(
    text_separator:str = "\n",
    do_strip_invisible_characters:bool = True):

    @unary()
    def inner(
        tag:bs4.element.Tag):

        return tag \
            .get_text(
                separator=text_separator,
                strip=do_strip_invisible_characters)

    return inner


# TODO test further
def to_bool_has_no_content_text():

    @unary()
    def inner(
        tag:bs4.element.Tag):

        return tag \
            >> to_text_content() \
            >> _texts.to_bool_is_empty()

    return inner


def to_text_attribute(
    name_attribute:str,
    text_default:typing.Optional[str] = None):

    @unary()
    def inner(
        tag:bs4.element.Tag):

        item_return = tag \
            .get(
                key=name_attribute,
                default=text_default)

        if isinstance(item_return, list):
            return " ".join(item_return)
        else:
            return item_return

    return inner


def to_text_attribute_href():

    """
    = to_text_attribute("href")

    return: tag attribute "href" (usually present in "a" tags and contains a link fragment)

    return None if not present
    """

    return to_text_attribute("href")


# TODO test further
def to_bool_has_attribute(
    name_attribute:str):

    @unary()
    def inner(
        tag:bs4.element.Tag):

        return tag \
            .has_attr(name_attribute)

    return inner


# TODO test further
def to_inplace_clear_attributes():

    @unary()
    def inner(
        tag:bs4.element.Tag):

        tag \
            .attrs \
            .clear()

        return tag

    return inner


# TODO test
def to_name():

    @unary()
    def inner(
        tag:bs4.element.Tag):

        return tag \
            .name

    return inner


def to_inplace_set_name_to(
    name_new:str):

    @unary()
    def inner(
        tag:bs4.element.Tag):

        tag.name = name_new

        return tag

    return inner


def to_inplace_remove():

    @unary()
    def inner(
        tag:bs4.element.Tag):

        tag \
            .extract()

        return tag

    return inner


def to_inplace_replace_with_children():

    @unary()
    def inner(
        tag:bs4.element.Tag):

        tag \
            .replace_with_children()

        return tag

    return inner


def to_inplace_set_attribute(
    name_attribute:str,
    text_value_new:str):

    @unary()
    def inner(
        tag:bs4.element.Tag):

        tag[name_attribute] = text_value_new
        return tag

    return inner


# TODO test further
def to_inplace_replace_with_others(
    iterable_elements_new:typing.Iterable[typing.Union[str, bs4.PageElement]]):

    """
    Replace the tag with multiple other page elements (or str)

    Return the tag that was replaced (no longer part of the tree)
    """

    @unary()
    def inner(
        tag:bs4.Tag):

        return tag \
            .replace_with(*iterable_elements_new)

    return inner


def to_inplace_modify_all(
    set_names_tags_remove:typing.Set[str] = set(),
    set_names_tags_remove_when_empty:typing.Set[str] = set(),
    set_names_tags_replace_with_children:typing.Set[str] = set(),
    set_names_tags_clear_attributes:typing.Set[str] = set(),
    dict_names_tags_rename:typing.Dict[str, str] = {}):

    """
    Inplace modify the tag passed as an argument.
    - The order of the modifications corresponds to the order of the function parameters.
    """

    @unary()
    def inner(
        tag:bs4.element.Tag):

        # TODO implement: perhaps modify tag itself too if matched by conditions

        def apply_modification_all(
            set_names_tags:typing.Set[str],
            function_modification:Function_unary[bs4.element.Tag, typing.Any]):

            @unary()
            def apply_modification_single(
                name_tag:str):

                tag \
                    >> to_list_tags_children(
                        name=name_tag,
                        bool_search_recursive=True) \
                    >> _iters.to_iterable_for_each_eager(function_modification)

            set_names_tags \
                >> _iters.to_iterable_for_each_eager(apply_modification_single)

        @unary()
        def inplace_remove_when_empty(
            tag:bs4.element.Tag):

            if tag >> _tags.to_bool_has_no_content_text():
                tag \
                    >> _tags.to_inplace_remove()

            return tag

        @unary()
        def inplace_rename_tags(
            pair_to_rename:typing.Tuple[typing.List[bs4.element.Tag], str]):

            list_tags_children, \
            name_new = pair_to_rename

            list_tags_children \
                >> _iters.to_iterable_for_each_eager(to_inplace_set_name_to(name_new))

            return pair_to_rename

        @unary()
        def get_pair_to_rename(
            pair_names:typing.Tuple[str, str]):

            name_old, \
            name_new = pair_names

            list_tags_children = tag \
                >> to_list_tags_children(
                    name=name_old,
                    bool_search_recursive=True)

            return (
                list_tags_children,
                name_new)

        apply_modification_all(
                set_names_tags=set_names_tags_remove,
                function_modification=to_inplace_remove())

        apply_modification_all(
                set_names_tags=set_names_tags_remove_when_empty,
                function_modification=inplace_remove_when_empty)

        apply_modification_all(
                set_names_tags=set_names_tags_replace_with_children,
                function_modification=to_inplace_replace_with_children())

        apply_modification_all(
                set_names_tags=set_names_tags_clear_attributes,
                function_modification=to_inplace_clear_attributes())

        # NOTE _iters.to_list() is used to force all "to_list_tags_children" to finish (must all be determined before modifications!)
        dict_names_tags_rename \
            >> _dicts.to_iterable_pairs() \
            >> _iters.to_iterable_mapped(get_pair_to_rename) \
            >> _iters.to_list() \
            >> _iters.to_iterable_for_each_eager(inplace_rename_tags)

        return tag

    return inner


def to_inplace_modify_tag_for_preview(
    bool_uppercase_headings:bool = True):

    """
    Inplace modify the tag such that it appears more like a displayed version when extracting the visible text.
    """

    @unary()
    def inner(
        tag:bs4.element.Tag):

        @unary()
        def get_text_li(
            tag_li:bs4.element.Tag):

            return tag_li \
                >> _tags.to_text_content() \
                >> _texts.to_text_replace(
                    text_old="\n",
                    text_new=" ") \
                >> _texts.to_text_prepend(" • ") \
                >> _texts.to_text_append("\n")

        if isinstance(tag, bs4.NavigableString):
            text_new = tag \
                >> _tags.to_text_content() \
                >> _texts.to_text_replace(
                    text_old="\n",
                    text_new=" ") \
                >> _texts.to_text_stripped()

            tag \
                .replace_with(text_new)

        elif tag.name.startswith("h"):

            text_new = tag \
                >> _tags.to_text_content() \
                >> _texts.to_text_replace(
                    text_old="\n",
                    text_new=" ") \
                >> _texts.to_text_prepend("\n") \
                >> _texts.to_text_append("\n") \
                >> _items.to_item_if(
                    function_when=_items.to_item_constant(bool_uppercase_headings),
                    function_then=_texts.to_text_upper())

            tag \
                .replace_with(text_new)

        elif tag.name == "ul":

            text_new = tag \
                >> _tags.to_list_tags_children("li") \
                >> _iters.to_iterable_mapped(get_text_li) \
                >> _iters.to_text_joined("") \
                >> _texts.to_text_prepend("\n")

            tag \
                .replace_with(text_new)

        else:
            tag \
                .children \
                >> _iters.to_list() \
                >> _iters.to_iterable_for_each_eager(
                    function=to_inplace_modify_tag_for_preview(
                        bool_uppercase_headings=bool_uppercase_headings))

            if not isinstance(tag, bs4.BeautifulSoup):
                tag \
                    >> _tags.to_inplace_replace_with_children()

        return tag

    return inner


def append_child(
    tag_to_append:bs4.element.Tag):

    @unary()
    def inner(
        tag:bs4.element.Tag):

        assert isinstance(tag, bs4.element.Tag)

        return tag \
            .append(
                tag_to_append)

    return inner


def wrap_with_new_tag(
    name:str,
    dict_attributes:typing.Dict[str, str] = {}):

    @unary()
    def inner(
        tag:bs4.element.Tag):

        assert isinstance(tag, bs4.element.Tag)

        new_tag = bs4 \
            .BeautifulSoup(
                f"<{name}></{name}>",
                "html.parser") \
            .find(name)

        new_tag \
            .attrs \
            .update(dict_attributes)

        tag \
            .wrap(
                new_tag)

        return tag

    return inner