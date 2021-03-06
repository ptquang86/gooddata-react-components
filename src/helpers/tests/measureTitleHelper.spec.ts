// (C) 2007-2018 GoodData Corporation
import { fillMissingTitles } from '../measureTitleHelper';
import { visualizationObjects } from '../../../__mocks__/fixtures';
import { VisualizationObject } from '@gooddata/typings';
import IVisualizationObjectContent = VisualizationObject.IVisualizationObjectContent;
import IMeasure = VisualizationObject.IMeasure;

function findVisualizationObjectFixture(metaTitle: string): IVisualizationObjectContent {
    const visualizationObject = visualizationObjects.find(chart =>
        chart.visualizationObject.meta.title === metaTitle
    );
    return visualizationObject.visualizationObject.content;
}

describe('measureTitleHelper', () => {
    describe('fillMissingTitles', () => {
        const locale = 'en-US';

        it('should set title of derived measures based on master title when master is NOT renamed', () => {
            const visualizationObjectContent = findVisualizationObjectFixture('Over time comparison');
            const result = fillMissingTitles(visualizationObjectContent, locale);

            expect(result.buckets[0].items).toEqual(
                [
                    {
                        measure: {
                            localIdentifier: 'm1',
                            title: '# Accounts with AD Query',
                            definition: {
                                measureDefinition: {
                                    item: {
                                        uri: '/gdc/md/myproject/obj/8172'
                                    }
                                }
                            }
                        }
                    },
                    {
                        measure: {
                            localIdentifier: 'm1_pop',
                            title: '# Accounts with AD Query - SP year ago',
                            definition: {
                                popMeasureDefinition: {
                                    measureIdentifier: 'm1',
                                    popAttribute: {
                                        uri: '/gdc/md/myproject/obj/1514'
                                    }
                                }
                            }
                        }
                    },
                    {
                        measure: {
                            localIdentifier: 'm1_previous_period',
                            title: '# Accounts with AD Query - period ago',
                            definition: {
                                previousPeriodMeasure: {
                                    measureIdentifier: 'm1',
                                    dateDataSets: [{
                                        dataSet: {
                                            uri: '/gdc/md/myproject/obj/921'
                                        },
                                        periodsAgo: 1
                                    }]
                                }
                            }
                        }
                    }
                ]
            );
        });

        it('should set title of derived measures based on master alias when master is renamed', () => {
            const visualizationObjectContent = findVisualizationObjectFixture('Over time comparison alias');
            const result = fillMissingTitles(visualizationObjectContent, locale);

            expect(result.buckets[0].items).toEqual(
                [
                    {
                        measure: {
                            localIdentifier: 'm1',
                            title: '# Accounts with AD Query',
                            alias: 'AD Queries',
                            definition: {
                                measureDefinition: {
                                    item: {
                                        uri: '/gdc/md/myproject/obj/8172'
                                    }
                                }
                            }
                        }
                    },
                    {
                        measure: {
                            localIdentifier: 'm1_pop',
                            title: 'AD Queries - SP year ago',
                            definition: {
                                popMeasureDefinition: {
                                    measureIdentifier: 'm1',
                                    popAttribute: {
                                        uri: '/gdc/md/myproject/obj/1514'
                                    }
                                }
                            }
                        }
                    },
                    {
                        measure: {
                            localIdentifier: 'm1_previous_period',
                            title: 'AD Queries - period ago',
                            definition: {
                                previousPeriodMeasure: {
                                    measureIdentifier: 'm1',
                                    dateDataSets: [{
                                        dataSet: {
                                            uri: '/gdc/md/myproject/obj/921'
                                        },
                                        periodsAgo: 1
                                    }]
                                }
                            }
                        }
                    }
                ]
            );
        });

        it('should set title of derived based on master title even when it is located in a different bucket', () => {
            const visualizationObjectContent = findVisualizationObjectFixture('Headline over time comparison');
            const result = fillMissingTitles(visualizationObjectContent, locale);

            expect(result.buckets[0].items).toEqual(
                [
                    {
                        measure: {
                            localIdentifier: 'fdd41e4ca6224cd2b5ecce15fdabf062',
                            title: 'Sum of Email Clicks',
                            format: '#,##0.00',
                            definition: {
                                measureDefinition: {
                                    aggregation: 'sum',
                                    item: {
                                        uri: '/gdc/md/yrungi0zwpoud7h1kmh6ldhp0vgkpi41/obj/15428'
                                    }
                                }
                            }
                        }
                    }
                ]
            );

            expect(result.buckets[1].items).toEqual(
                [
                    {
                        measure: {
                            localIdentifier: 'fdd41e4ca6224cd2b5ecce15fdabf062_pop',
                            title: 'Sum of Email Clicks - SP year ago',
                            definition: {
                                popMeasureDefinition: {
                                    measureIdentifier: 'fdd41e4ca6224cd2b5ecce15fdabf062',
                                    popAttribute: {
                                        uri: '/gdc/md/yrungi0zwpoud7h1kmh6ldhp0vgkpi41/obj/15330'
                                    }
                                }
                            }
                        }
                    },
                    {
                        measure: {
                            localIdentifier: 'fdd41e4ca6224cd2b5ecce15fdabf062_previous_period',
                            title: 'Sum of Email Clicks - period ago',
                            definition: {
                                previousPeriodMeasure: {
                                    measureIdentifier: 'fdd41e4ca6224cd2b5ecce15fdabf062',
                                    dateDataSets: [{
                                        dataSet: {
                                            uri: '/gdc/md/yrungi0zwpoud7h1kmh6ldhp0vgkpi41/obj/921'
                                        },
                                        periodsAgo: 1
                                    }]
                                }
                            }
                        }
                    }
                ]
            );
        });

        function getTitleOfMeasure(visualizationObject: IVisualizationObjectContent, localIdentifier: string): string {
            const measureBucketItems = visualizationObject.buckets[0].items;
            const matchingMeasure: IMeasure = measureBucketItems
                .map(bucketItem => bucketItem as IMeasure)
                .find(bucketItem => bucketItem.measure.localIdentifier === localIdentifier);

            return matchingMeasure === undefined ? undefined : matchingMeasure.measure.title;
        }

        it('should set correct titles to arithmetic measures in simple tree', () => {
            const visualizationObjectContent = findVisualizationObjectFixture('Arithmetic measures tree');
            const result = fillMissingTitles(visualizationObjectContent, locale);

            expect(getTitleOfMeasure(result, 'tree_level_0'))
                .toEqual('Sum of AD Accounts and KD Accounts');

            expect(getTitleOfMeasure(result, 'tree_level_1'))
                .toEqual('Sum of AD Accounts and Sum of AD Accounts and KD Accounts');

            expect(getTitleOfMeasure(result, 'tree_level_2'))
                .toEqual('Sum of AD Accounts and Sum of AD Accounts and Sum of AD Accounts and KD Accounts');
        });

        it('should set correct titles to arithmetic measures in the complex tree', () => {
            const visualizationObjectContent = findVisualizationObjectFixture('Arithmetic measures');
            const result = fillMissingTitles(visualizationObjectContent, locale);

            expect(getTitleOfMeasure(result, 'arithmetic_measure_created_from_complicated_arithmetic_measures'))
                .toEqual('Sum of Sum of Sum of AD Queries and KD Queries and Sum of Renamed SP last year M1 ' +
                    'and Renamed previous period M1 and Sum of # Accounts with AD Query and # Accounts with KD Query');

            expect(getTitleOfMeasure(result, 'arithmetic_measure_created_from_simple_measures'))
                .toEqual('Sum of # Accounts with AD Query and # Accounts with KD Query');

            expect(getTitleOfMeasure(result, 'arithmetic_measure_created_from_renamed_simple_measures'))
                .toEqual('Sum of AD Queries and KD Queries');

            expect(getTitleOfMeasure(result, 'arithmetic_measure_created_from_derived_measures'))
                .toEqual('Sum of # Accounts with AD Query - SP year ago and # Accounts with AD Query - period ago');

            expect(getTitleOfMeasure(result, 'arithmetic_measure_created_from_renamed_derived_measures'))
                .toEqual('Sum of Renamed SP last year M1 and Renamed previous period M1');

            expect(getTitleOfMeasure(result, 'arithmetic_measure_created_from_arithmetic_measures'))
                .toEqual('Sum of Sum of AD Queries and KD Queries and Sum of Renamed SP last year M1 and ' +
                    'Renamed previous period M1');

            expect(getTitleOfMeasure(result, 'invalid_arithmetic_measure_with_missing_dependency'))
                .toBeUndefined();

            expect(getTitleOfMeasure(result, 'invalid_arithmetic_measure_with_cyclic_dependency_1'))
                .toBeUndefined();

            expect(getTitleOfMeasure(result, 'invalid_arithmetic_measure_with_cyclic_dependency_2'))
                .toBeUndefined();
        });
    });
});
