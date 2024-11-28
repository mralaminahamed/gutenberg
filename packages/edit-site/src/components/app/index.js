/**
 * WordPress dependencies
 */
import { store as noticesStore } from '@wordpress/notices';
import { useDispatch } from '@wordpress/data';
import { __, sprintf } from '@wordpress/i18n';
import { PluginArea } from '@wordpress/plugins';
import { privateApis as routerPrivateApis } from '@wordpress/router';

/**
 * Internal dependencies
 */
import Layout from '../layout';
import { unlock } from '../../lock-unlock';
import { useCommonCommands } from '../../hooks/commands/use-common-commands';
import useActiveRoute from '../layout/router';
import useSetCommandContext from '../../hooks/commands/use-set-command-context';
import { useRegisterSiteEditorRoutes } from '../site-editor-routes';

const { RouterProvider } = unlock( routerPrivateApis );

function AppLayout() {
	useCommonCommands();
	useSetCommandContext();
	useRegisterSiteEditorRoutes();
	const route = useActiveRoute();

	return <Layout route={ route } />;
}

export default function App() {
	const { createErrorNotice } = useDispatch( noticesStore );

	function onPluginAreaError( name ) {
		createErrorNotice(
			sprintf(
				/* translators: %s: plugin name */
				__(
					'The "%s" plugin has encountered an error and cannot be rendered.'
				),
				name
			)
		);
	}

	return (
		<RouterProvider>
			<AppLayout />
			<PluginArea onError={ onPluginAreaError } />
		</RouterProvider>
	);
}
