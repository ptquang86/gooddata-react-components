// (C) 2019-2020 GoodData Corporation
import mapboxgl from "mapbox-gl";
import {
    createPushpinDataLayer,
    createClusterLabels,
    createClusterPoints,
    createUnclusterPoints,
} from "../geoChartDataLayers";
import { IGeoData, IGeoConfig } from "../../../../interfaces/GeoChart";
import { LOCATION_LNGLATS, SIZE_NUMBERS } from "../../../../../stories/data/geoChart";

describe("createPushpinDataLayer", () => {
    const dataSourceName: string = "test_datasource";
    const mapboxConfig: IGeoConfig = {
        mapboxToken: "fakemapboxtoken",
    };

    it("should return default border, color and size", () => {
        const geoData: IGeoData = {
            location: {
                index: 0,
                name: "location",
                data: [],
            },
        };
        const layer: mapboxgl.Layer = createPushpinDataLayer(dataSourceName, geoData, mapboxConfig);

        expect(layer.paint["circle-color"]).toEqual([
            "string",
            ["get", "background", ["object", ["get", "color"]]],
        ]);
        expect(layer.paint["circle-radius"]).toBe(4);
        expect(layer.paint["circle-stroke-color"]).toEqual([
            "string",
            ["get", "border", ["object", ["get", "color"]]],
            "rgb(233,237,241)",
        ]);
    });

    it("should return default border, color and size when Color, Size contains same values", () => {
        const geoData: IGeoData = {
            size: {
                index: 0,
                name: "size",
                data: [1, 1, 1],
                format: "#,##0.00",
            },
            color: {
                index: 1,
                name: "color",
                data: [10, 10, 10],
                format: "#,##0.00",
            },
            location: {
                index: 0,
                name: "location",
                data: [
                    {
                        lat: -89.5,
                        lng: 44.5,
                    },
                    {
                        lat: -89.5,
                        lng: 44.5,
                    },
                    {
                        lat: -89.5,
                        lng: 44.5,
                    },
                ],
            },
        };
        const layer: mapboxgl.Layer = createPushpinDataLayer(dataSourceName, geoData, mapboxConfig);

        expect(layer.paint["circle-color"]).toEqual([
            "string",
            ["get", "background", ["object", ["get", "color"]]],
        ]);
        expect(layer.paint["circle-radius"]).toBe(4);
        expect(layer.paint["circle-stroke-color"]).toEqual([
            "string",
            ["get", "border", ["object", ["get", "color"]]],
            "rgb(233,237,241)",
        ]);
    });

    it("should return border, color palette and size scale", () => {
        const geoData: IGeoData = {
            size: {
                index: 0,
                name: "size",
                format: "#,##0",
                data: SIZE_NUMBERS,
            },
            color: {
                index: 1,
                name: "color",
                format: "#,##0",
                data: [],
            },
            location: {
                index: 0,
                name: "location",
                data: LOCATION_LNGLATS,
            },
            segment: {
                index: 1,
                name: "segment",
                data: [],
            },
            tooltipText: {
                index: 2,
                name: "tooltipText",
                data: [],
            },
        };
        const layer: mapboxgl.Layer = createPushpinDataLayer(dataSourceName, geoData, mapboxConfig);

        expect(layer.paint["circle-color"]).toEqual([
            "string",
            ["get", "background", ["object", ["get", "color"]]],
        ]);
        expect(layer.paint["circle-radius"]).toEqual([
            "step",
            ["get", "pushpinSize"],
            4,
            13.24,
            7,
            21.91,
            11,
            36.26,
            18,
            60,
            30,
        ]);
        expect(layer.paint["circle-stroke-color"]).toEqual([
            "string",
            ["get", "border", ["object", ["get", "color"]]],
            "rgb(233,237,241)",
        ]);
    });

    it("should return border and color palette with segment", () => {
        const geoData: IGeoData = {
            size: {
                index: 0,
                name: "size",
                format: "#,##0",
                data: [],
            },
            color: {
                index: 1,
                name: "color",
                format: "#,##0",
                data: [],
            },
            location: {
                index: 0,
                name: "location",
                data: [],
            },
            segment: {
                index: 1,
                name: "segment",
                data: [],
            },
        };
        const layer: mapboxgl.Layer = createPushpinDataLayer(dataSourceName, geoData, mapboxConfig);

        expect(layer.paint["circle-color"]).toEqual([
            "string",
            ["get", "background", ["object", ["get", "color"]]],
        ]);

        expect(layer.paint["circle-stroke-color"]).toEqual([
            "string",
            ["get", "border", ["object", ["get", "color"]]],
            "rgb(233,237,241)",
        ]);
    });

    it("should return filter", () => {
        const geoData: IGeoData = {
            size: {
                index: 0,
                name: "size",
                format: "#,##0",
                data: [],
            },
            color: {
                index: 1,
                name: "color",
                format: "#,##0",
                data: [],
            },
            location: {
                index: 0,
                name: "location",
                data: [],
            },
            segment: {
                index: 1,
                name: "segment",
                data: [],
            },
        };
        const selectedSegmentItems = ["Hawaii", "HCM"];
        const layer: mapboxgl.Layer = createPushpinDataLayer(dataSourceName, geoData, {
            ...mapboxConfig,
            selectedSegmentItems,
        });

        expect(layer.filter).toEqual([
            "match",
            ["get", "value", ["object", ["get", "segment"]]],
            ["Hawaii", "HCM"],
            true,
            false,
        ]);
    });

    describe("Cluster Layers", () => {
        it("should create cluster point layer", () => {
            expect(createClusterPoints("test_datasource")).toEqual({
                filter: ["has", "point_count"],
                id: "gdcClusters",
                paint: {
                    "circle-color": [
                        "step",
                        ["get", "point_count"],
                        "#00D398",
                        10,
                        "#F38700",
                        100,
                        "#E84C3C",
                    ],
                    "circle-radius": ["step", ["get", "point_count"], 15, 100, 25],
                    "circle-stroke-color": [
                        "step",
                        ["get", "point_count"],
                        "#00D398",
                        10,
                        "#F38700",
                        100,
                        "#E84C3C",
                    ],
                    "circle-stroke-opacity": 0.2,
                    "circle-stroke-width": 8,
                },
                source: "test_datasource",
                type: "circle",
            });
        });

        it("should create clustered label layer", () => {
            expect(createClusterLabels("test_datasource")).toEqual({
                filter: ["has", "point_count"],
                id: "gdcClusterLabels",
                layout: {
                    "text-allow-overlap": true,
                    "text-field": "{point_count_abbreviated}",
                    "text-font": ["Lato Bold"],
                    "text-size": 14,
                },
                paint: {
                    "text-color": "#fff",
                },
                source: "test_datasource",
                type: "symbol",
            });
        });

        it("should create unclustered points layer", () => {
            expect(createUnclusterPoints("test_datasource")).toEqual({
                filter: ["!", ["has", "point_count"]],
                id: "gdcPushpins",
                paint: {
                    "circle-color": ["string", ["get", "background", ["object", ["get", "color"]]]],
                    "circle-radius": 4,
                    "circle-stroke-color": "rgb(233,237,241)",
                    "circle-stroke-width": 1,
                },
                source: "test_datasource",
                type: "circle",
            });
        });
    });
});
