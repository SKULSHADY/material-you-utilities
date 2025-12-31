import { Connection } from 'home-assistant-js-websocket';
import { html } from 'lit';
import {
	CardHelpers,
	HomeAssistant,
	IConfirmation,
} from '../models/interfaces';
import {
	EntityRegistryEntryUpdateParams,
	InputDomain,
	LabelRegistryEntry,
	LabelRegistryEntryMutableParams,
} from '../models/interfaces/Input';

/**
 * Create an input entity
 * @param {HomeAssistant} hass Home Assistant HASS object
 * @param {InputDomain} type Input element type to create
 * @param {Record<string, any>} config Input helper init config
 * @returns {Promise<Record<string, any>>}  Input helper init config, with default values for fields not provided
 */
export async function createInput(
	hass: HomeAssistant,
	type: InputDomain,
	config: Record<string, unknown>,
): Promise<Record<string, unknown>> {
	return await hass.callWS({
		type: `${type}/create`,
		...config,
	});
}

/**
 * Update an input entity
 * @param {HomeAssistant} hass Home Assistant HASS object
 * @param {InputDomain} type Input element type to create
 * @param {string} id Element ID, not including domain
 * @returns {Promise<Record<string, any>>}  Input helper update config, replaces current config
 */
export async function updateInput(
	hass: HomeAssistant,
	domain: InputDomain,
	id: string,
	config: Record<string, unknown>,
): Promise<Record<string, unknown>> {
	return await hass.callWS({
		type: `${domain}/update`,
		[`${domain}_id`]: id,
		...config,
	});
}

/**
 * Delete an input entity
 * @param {HomeAssistant} hass Home Assistant HASS object
 * @param {InputDomain} type Input element type to create
 * @param {string} id Element ID, not including domain
 */
export async function deleteInput(
	hass: HomeAssistant,
	domain: InputDomain,
	id: string,
) {
	await hass.callWS({
		type: `${domain}/delete`,
		[`${domain}_id`]: id,
	});
}

/**
 * Fetch label registry
 * @param {Connection} conn
 * @returns {LabelRegistryEntry[]} labels
 */
export async function fetchLabelRegistry(
	conn: Connection,
): Promise<LabelRegistryEntry[]> {
	const labels = (await conn.sendMessagePromise({
		type: 'config/label_registry/list',
	})) as LabelRegistryEntry[];
	labels.sort((ent1, ent2) => ent1.name.localeCompare(ent2.name));
	return labels;
}

/**
 * Create label registry entry
 * @param {HomeAssistant} hass
 * @param {LabelRegistryEntryMutableParams} values
 */
export async function createLabelRegistryEntry(
	hass: HomeAssistant,
	values: LabelRegistryEntryMutableParams,
) {
	await hass.callWS({
		type: 'config/label_registry/create',
		...values,
	});
}

/**
 * Update entity registry entry
 * @param {HomeAssistant} hass
 * @param {string} entityId
 * @param {Partial<EntityRegistryEntryUpdateParams} updates
 */
export async function updateEntityRegistryEntry(
	hass: HomeAssistant,
	entityId: string,
	updates: Partial<EntityRegistryEntryUpdateParams>,
) {
	await hass.callWS({
		type: 'config/entity_registry/update',
		entity_id: entityId,
		...updates,
	});
}

let helpers: CardHelpers;

/**
 * Use a hass-action event to call a confirmation, and use ll-custom and dialog-closed listeners to determine the result
 * @param {Node} node Node to fire the event on
 * @param {boolean | IConfirmation} confirmation Confirmation config or boolean
 * @returns {Promise<boolean>} The result of the confirmation
 */
export async function handleConfirmation(
	node: HTMLElement,
	confirmation: boolean | IConfirmation,
): Promise<boolean> {
	// Short circuit if confirmation is false
	if (!confirmation) {
		return true;
	}

	if (!helpers) {
		helpers = await window.loadCardHelpers();
	}

	return await helpers.showConfirmationDialog(node, {
		text: (confirmation as IConfirmation)?.text,
		confirm: () => true,
		cancel: () => false,
		destructive: true,
	});
}

export function buildAlertBox(
	title: string,
	type: 'info' | 'warning' | 'error' | 'success' = 'info',
) {
	return html`<ha-alert .title="${title}" .alertType="${type}"></ha-alert>`;
}
