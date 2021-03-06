// (C) 2007-2018 GoodData Corporation
import React, { Component } from 'react';
import { BarChart } from '@gooddata/react-components';

import '@gooddata/react-components/styles/css/main.css';

import {
    totalSalesIdentifier,
    locationResortIdentifier,
    menuCategoryAttributeDFIdentifier,
    projectId
} from '../utils/fixtures';
import { CUSTOM_COLOR_PALETTE } from '../utils/colors';

const defaultProperties = {};

export class BarChartDynamicExample extends Component {
    constructor(props) {
        super(props);

        this.state = {
            config: defaultProperties,
            customPaletteUsed: false
        };
        this.onPaletteChange = this.onPaletteChange.bind(this);
    }

    onPaletteChange() {
        const {
            config: currentConfig,
            customPaletteUsed
        } = this.state;
        const colorPaletteProp = {
            colorPalette: customPaletteUsed ? undefined : CUSTOM_COLOR_PALETTE
        };
        this.setState({
            config: {
                ...currentConfig,
                ...colorPaletteProp
            },
            customPaletteUsed: !customPaletteUsed
        });
    }

    render() {
        const {
            config
        } = this.state;

        const amount = {
            measure: {
                localIdentifier: 'amount',
                definition: {
                    measureDefinition: {
                        item: {
                            identifier: totalSalesIdentifier
                        }
                    }
                },
                alias: '$ Total Sales',
                format: '#,##0'
            }
        };

        const locationResort = {
            visualizationAttribute: {
                displayForm: {
                    identifier: locationResortIdentifier
                },
                localIdentifier: 'location_resort'
            }
        };

        const menuCategory = {
            visualizationAttribute: {
                displayForm: {
                    identifier: menuCategoryAttributeDFIdentifier
                },
                localIdentifier: 'label.menuitem.menucategory'
            }
        };
        return (
            <div>
                <button onClick={this.onPaletteChange}>
                    Change palette
                </button>
                <div style={{ height: 300 }} className="s-bar-chart">
                    <BarChart
                        projectId={projectId}
                        measures={[amount]}
                        viewBy={locationResort}
                        stackBy={menuCategory}
                        config={config}
                    />
                </div>
            </div>
        );
    }
}

export default BarChartDynamicExample;
