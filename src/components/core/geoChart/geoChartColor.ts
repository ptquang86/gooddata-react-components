// (C) 2020 GoodData Corporation
import range = require("lodash/range");
import isEmpty = require("lodash/isEmpty");
import isFinite = require("lodash/isFinite");
import { getColorPalette } from "../../visualizations/utils/color";
import {
    DEFAULT_PUSHPIN_BORDER_COLOR_VALUE,
    DEFAULT_PUSHPIN_COLOR_SCALE,
    EMPTY_SEGMENT_ITEM,
} from "../../../constants/geoChart";
import { IObjectMapping, IPushpinColor } from "../../../interfaces/GeoChart";
import { IColorLegendItem } from "../../visualizations/typings/legend";
import { getMinMax } from "../../../helpers/utils";
import { IColorStrategy } from "../../visualizations/chart/colorFactory";
import { IColorAssignment } from "../../../interfaces/Config";
import { isMappingHeaderAttributeItem, isMappingHeaderAttribute } from "../../../interfaces/MappingHeader";

const DEFAULT_SEGMENT_ITEM = "default_segment_item";
const DEFAULT_COLOR_INDEX_IN_PALETTE = DEFAULT_PUSHPIN_COLOR_SCALE - 1;

export function getColorIndexInPalette(value: number, min: number, max: number): number {
    if (!isFinite(value) || min === max || value === min) {
        return 0;
    }

    if (value === max) {
        return DEFAULT_COLOR_INDEX_IN_PALETTE;
    }

    const step = (max - min) / DEFAULT_PUSHPIN_COLOR_SCALE;
    for (let i = 0, offset = min; i < DEFAULT_PUSHPIN_COLOR_SCALE; i++, offset += step) {
        if (offset >= value) {
            return i;
        }
    }

    return DEFAULT_COLOR_INDEX_IN_PALETTE;
}

export function getColorPaletteMapping(colorStrategy: IColorStrategy): IObjectMapping {
    const colorAssignment: IColorAssignment[] = colorStrategy.getColorAssignment();
    return colorAssignment.reduce(
        (result: IObjectMapping, item: IColorAssignment, index: number): IObjectMapping => {
            const color = colorStrategy.getColorByIndex(index);
            const colorPalette = getColorPalette(color);
            // color base on Location
            if (isMappingHeaderAttribute(item.headerItem)) {
                return {
                    [DEFAULT_SEGMENT_ITEM]: colorPalette,
                };
            }
            // color base on SegmentBy
            const name: string = isMappingHeaderAttributeItem(item.headerItem)
                ? item.headerItem.attributeHeaderItem.name
                : DEFAULT_SEGMENT_ITEM;
            return {
                ...result,
                [name]: colorPalette,
            };
        },
        {},
    );
}

/**
 * Return RGB border and background colors base on color and segment values
 *  Example:
 *      [any-number] => [{
 *           border: "rgb(127,224,198)",
 *           background: "rgb(215,242,250)",
 *      }]
 * @param colorValues
 * @param segmentValues
 */
export function getPushpinColors(
    colorValues: number[],
    segmentValues: string[] = [],
    colorStrategy: IColorStrategy,
): IPushpinColor[] {
    const defaultColor = colorStrategy.getColorByIndex(0);

    if (!colorValues.length && !segmentValues.length) {
        return [
            {
                border: DEFAULT_PUSHPIN_BORDER_COLOR_VALUE,
                background: defaultColor,
            },
        ];
    }

    const segmentNames: string[] = segmentValues.map((value: string): string => value || EMPTY_SEGMENT_ITEM);
    const colorPaletteMapping: IObjectMapping = getColorPaletteMapping(colorStrategy);
    if (!colorValues.length) {
        return segmentNames.map(
            (name: string): IPushpinColor => {
                const palette = colorPaletteMapping[name];
                return {
                    border: DEFAULT_PUSHPIN_BORDER_COLOR_VALUE,
                    background: palette[DEFAULT_COLOR_INDEX_IN_PALETTE],
                };
            },
        );
    }

    const colorsWithoutNull = colorValues.filter(isFinite);
    const { min, max } = getMinMax(colorsWithoutNull);

    if (min === max && !segmentValues.length) {
        return [
            {
                border: DEFAULT_PUSHPIN_BORDER_COLOR_VALUE,
                background: defaultColor,
            },
        ];
    }

    return colorValues.map(
        (color: number, index: number): IPushpinColor => {
            const value = isFinite(color) ? color : min;
            const colorIndex = getColorIndexInPalette(value, min, max);
            const segmentItemName = segmentNames[index] || DEFAULT_SEGMENT_ITEM;
            const palette = colorPaletteMapping[segmentItemName];

            return {
                border: palette[DEFAULT_COLOR_INDEX_IN_PALETTE],
                background: palette[colorIndex],
            };
        },
    );
}

export function generateLegendColorData(colorSeries: number[], colorString: string): IColorLegendItem[] {
    if (isEmpty(colorSeries)) {
        return [];
    }
    const colorPalette = getColorPalette(colorString);
    const min = Math.min(...colorSeries);
    const max = Math.max(...colorSeries);
    const offset = (max - min) / DEFAULT_PUSHPIN_COLOR_SCALE;

    if (min === max) {
        return [];
    }

    return range(0, DEFAULT_PUSHPIN_COLOR_SCALE).map(
        (index: number): IColorLegendItem => {
            const from = min + offset * index;
            const isLastItem = index === DEFAULT_PUSHPIN_COLOR_SCALE - 1;
            const to = isLastItem ? max : from + offset;
            const range = {
                from,
                to,
            };
            return {
                range,
                color: colorPalette[index],
            };
        },
    );
}
