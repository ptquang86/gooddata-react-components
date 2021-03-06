// (C) 2007-2018 GoodData Corporation
import * as React from 'react';
import * as PropTypes from 'prop-types';
import { IHeaderParams } from 'ag-grid';
import { AFM } from '@gooddata/typings';

import { getParsedFields } from '../../../helpers/agGrid';
import { IHeaderReactComp } from 'ag-grid-react/lib/interfaces';
import HeaderCell, { ALIGN_LEFT, ALIGN_RIGHT } from './HeaderCell';

export interface IPivotHeaderState {
    sorting?: AFM.SortDirection;
}

export const ASC: AFM.SortDirection = 'asc';
export const DESC: AFM.SortDirection = 'desc';
export const ATTRIBUTE_FIELD_TYPE = 'a';

class PivotHeader extends React.Component<IHeaderParams, IPivotHeaderState> implements IHeaderReactComp {
    public static propTypes = {
        enableMenu: PropTypes.bool,
        enableSorting: PropTypes.bool,
        displayName: PropTypes.string,
        column: PropTypes.any,
        reactContainer: PropTypes.any,
        showColumnMenu: PropTypes.func,
        setSort: PropTypes.func
    };

    public state: IPivotHeaderState = {
        sorting: null
    };

    public componentWillMount() {
        this.props.column.addEventListener('sortChanged', this.getCurrentSortDirection);
        this.setState({
            sorting: this.props.column.getSort() as AFM.SortDirection
        });
    }

    public componentWillUnmount() {
        this.props.column.removeEventListener('sortChanged', this.getCurrentSortDirection);
    }

    public getCurrentSortDirection = () => {
        const currentSort: AFM.SortDirection = this.props.column.getSort() as AFM.SortDirection;
        this.setState({
            sorting: currentSort
        });
    }

    public getDefaultSortDirection(): AFM.SortDirection {
        return (this.getFieldType() === ATTRIBUTE_FIELD_TYPE) ? ASC : DESC;
    }

    public onMenuClick = () => {
        // tslint:disable-next-line no-console
        console.log('menu clicked');
    }

    public onSortRequested = (sortDir: AFM.SortDirection) => {
        const multiSort = false; // Enable support for multisort with CMD key with 'event.shiftKey';
        this.props.setSort(sortDir, multiSort);
    }

    public render() {
        const { displayName, enableSorting, enableMenu } = this.props;
        const textAlign = this.getFieldType() === ATTRIBUTE_FIELD_TYPE ? ALIGN_LEFT : ALIGN_RIGHT;

        return (
            <HeaderCell
                textAlign={textAlign}
                displayText={displayName}
                enableMenu={enableMenu}
                enableSorting={enableSorting}
                sortDirection={this.state.sorting}
                defaultSortDirection={this.getDefaultSortDirection()}
                onSortClick={this.onSortRequested}
                onMenuClick={this.onMenuClick}
            />
        );
    }

    private getFieldType() {
        const colId = this.props.column.getColId();
        const fields = getParsedFields(colId);
        const [lastFieldType] = fields[fields.length - 1];

        return lastFieldType;
    }
}

export default PivotHeader;
