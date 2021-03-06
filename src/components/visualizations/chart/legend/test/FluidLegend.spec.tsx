// (C) 2007-2018 GoodData Corporation
import * as React from 'react';
import { shallow } from 'enzyme';
import noop = require('lodash/noop');

import { VisualizationTypes } from '../../../../../constants/visualizationTypes';
import FluidLegend from '../FluidLegend';
import LegendItem from '../LegendItem';

describe('FluidLegend', () => {
    function render(customProps: any = {}) {
        const props = {
            chartType: VisualizationTypes.BAR,
            series: [],
            onItemClick: noop,
            containerWidth: 500,
            ...customProps
        };
        return shallow(
            <FluidLegend {...props} />
        );
    }

    it('should render items', () => {
        const series = [
            {
                name: 'A',
                color: '#333',
                isVisible: true
            },
            {
                name: 'B',
                color: '#333',
                isVisible: true
            },
            {
                name: 'A',
                color: '#333',
                isVisible: true
            }
        ];

        const wrapper = render({ series });
        expect(wrapper.find(LegendItem)).toHaveLength(3);
    });
});
