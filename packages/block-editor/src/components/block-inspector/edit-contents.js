/**
 * WordPress dependencies
 */
import { Button, __experimentalVStack as VStack } from '@wordpress/components';
import { useDispatch, useSelect } from '@wordpress/data';
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import { store as blockEditorStore } from '../../store';
import { unlock } from '../../lock-unlock';

export default function EditContents( { clientId } ) {
	const { editContentOnlySection, stopEditingContentOnlySection } = unlock(
		useDispatch( blockEditorStore )
	);
	const {
		attributes,
		isContentOnlyTemplateLocked,
		isWithinEditedSection,
		editedContentOnlySection,
	} = useSelect(
		( select ) => {
			const {
				getBlockAttributes,
				getEditedContentOnlySection,
				getTemplateLock,
				isWithinEditedContentOnlySection,
			} = unlock( select( blockEditorStore ) );

			return {
				attributes: getBlockAttributes( clientId ),
				isWithinEditedSection:
					isWithinEditedContentOnlySection( clientId ),
				editedContentOnlySection: getEditedContentOnlySection(),
				isContentOnlyTemplateLocked:
					getTemplateLock( clientId ) === 'contentOnly',
			};
		},
		[ clientId ]
	);

	if (
		! attributes?.metadata?.patternName &&
		! isContentOnlyTemplateLocked &&
		! isWithinEditedSection
	) {
		return null;
	}

	return (
		<VStack className="block-editor-block-inspector-edit-contents" expanded>
			<Button
				className="block-editor-block-inspector-edit-contents__button"
				__next40pxDefaultSize
				variant="secondary"
				onClick={ () => {
					if ( ! editedContentOnlySection ) {
						editContentOnlySection( clientId );
					} else {
						stopEditingContentOnlySection();
					}
				} }
			>
				{ editedContentOnlySection
					? __( 'Lock design' )
					: __( 'Unlock design' ) }
			</Button>
		</VStack>
	);
}
