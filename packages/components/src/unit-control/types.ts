/**
 * External dependencies
 */
import type { FocusEventHandler, SyntheticEvent } from 'react';

/**
 * Internal dependencies
 */
import type {
	InputChangeCallback,
	InputControlProps,
	Size as InputSize,
} from '../input-control/types';
import type { NumberControlProps } from '../number-control/types';

export type SelectSize = InputSize;

export type WPUnitControlUnit = {
	/**
	 * The value for the unit, used in a CSS value (e.g `px`).
	 */
	value: string;
	/**
	 * The label used in a dropdown selector for the unit.
	 */
	label: string;
	/**
	 * Default value (quantity) for the unit, used when switching units.
	 */
	default?: number;
	/**
	 * An accessible label used by screen readers.
	 */
	a11yLabel?: string;
	/**
	 * A step value used when incrementing/decrementing the value.
	 */
	step?: number;
};

export type UnitControlOnChangeCallback = InputChangeCallback<
	SyntheticEvent< HTMLSelectElement | HTMLInputElement >,
	{ data?: WPUnitControlUnit }
>;

export type UnitSelectControlProps = Pick< InputControlProps, 'size' > & {
	/**
	 * Whether the control can be focused via keyboard navigation.
	 *
	 * @default true
	 */
	isUnitSelectTabbable?: boolean;
	/**
	 * A callback function invoked when the value is changed.
	 */
	onChange?: UnitControlOnChangeCallback;
	/**
	 * Current unit.
	 */
	unit?: string;
	/**
	 * Available units to select from.
	 *
	 * @default CSS_UNITS
	 */
	units?: WPUnitControlUnit[];
};

export type UnitControlProps = Omit< UnitSelectControlProps, 'unit' > &
	Omit< NumberControlProps, 'hideHTMLArrows' | 'suffix' | 'type' > & {
		/**
		 * If `true`, the unit `<select>` is hidden.
		 *
		 * @default false
		 */
		disableUnits?: boolean;
		/**
		 * If `true`, and the selected unit provides a `default` value, this value is set
		 * when changing units.
		 *
		 * @default false
		 */
		isResetValueOnUnitChange?: boolean;
		/**
		 * Callback when the `unit` changes.
		 */
		onUnitChange?: UnitControlOnChangeCallback;
		/**
		 * Current unit. _Note: this prop is deprecated. Instead, provide a unit with a value through the `value` prop._
		 *
		 * @deprecated
		 */
		unit?: string;
		/**
		 * Current value. If passed as a string, the current unit will be inferred from this value.
		 * For example, a `value` of "50%" will set the current unit to `%`.
		 */
		value?: string | number;
		/**
		 * Callback when either the quantity or the unit inputs lose focus.
		 */
		onBlur?: FocusEventHandler< HTMLInputElement | HTMLSelectElement >;
		/**
		 * Custom CSS class to apply to the unit control's outer wrapper.
		 */
		wrapperClassName?: string;
	};
