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
	const { modifyContentLockBlock, stopEditingAsBlocks } = unlock(
		useDispatch( blockEditorStore )
	);
	const {
		attributes,
		isContentOnlyTemplateLocked,
		isWithinEditedSection,
		temporarilyEditingBlocks,
	} = useSelect(
		( select ) => {
			const {
				getBlockAttributes,
				getTemporarilyEditingAsBlocks,
				getTemplateLock,
				isWithinTemporarilyEditedSection,
			} = unlock( select( blockEditorStore ) );

			return {
				attributes: getBlockAttributes( clientId ),
				isWithinEditedSection:
					isWithinTemporarilyEditedSection( clientId ),
				temporarilyEditingBlocks: getTemporarilyEditingAsBlocks(),
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
					if ( ! temporarilyEditingBlocks ) {
						modifyContentLockBlock( clientId );
					} else {
						stopEditingAsBlocks();
					}
				} }
			>
				{ temporarilyEditingBlocks
					? __( 'Lock design' )
					: __( 'Unlock design' ) }
			</Button>
		</VStack>
	);
}
