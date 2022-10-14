<?php
/**
 * Overrides Core's wp-includes/rest-api.php and registers the new endpoint for WP 6.2.
 *
 * @package gutenberg
 */

/**
 * Use custom REST API Controller for Navigation Posts
 *
 * @param array $args the post type arguments.
 * @return array the filtered post type arguments with the new REST Controller set.
 */
function gutenberg_update_navigation_rest_controller( $args, $post_type ) {
	if ( in_array( $post_type, array( 'wp_navigation' ), true ) ) {
		// Original set in
		// https://github.com/WordPress/wordpress-develop/blob/6cbed78c94b9d8c6a9b4c8b472b88ee0cd56528c/src/wp-includes/post.php#L528.
		$args['rest_controller_class'] = 'Gutenberg_REST_Navigation_Controller';
	}
	return $args;
}
add_filter( 'register_post_type_args', 'gutenberg_update_navigation_rest_controller', 10, 2 );

function gutenberg_transform_slug_to_post_id( $response, $handler, WP_REST_Request $request ) {

	$route = rest_get_route_for_post_type_items( 'wp_navigation' );

	// Ignore non-Navigation REST API requests.
	if ( ! str_starts_with( $request->get_route(), $route ) ) {
		return $response;
	}

	// Get the slug from the request **URL** (not the request body).
	// PUT requests will have a param of `slug` in both the URL and (potentially)
	// in the body. In all cases only the slug in the URL should be mapped to a
	// postId in order that the correct post to be updated can be retrived.
	// The `slug` within the body should be preserved "as is".
	$slug = isset( $request->get_url_params()['slug'] ) ? $request->get_url_params()['slug'] : null;

	// If no slug provided assume ID and continue as normal.
	if ( empty( $slug ) ) {
		return $response;
	}

	$args = array(
		'name'                   => $slug, // query by slug
		'post_type'              => 'wp_navigation',
		'nopaging'               => true,
		'posts_per_page'         => '1',
		'update_post_term_cache' => false,
		'no_found_rows'          => true,
	);

	// Query for the Navigation Post by slug (post_name).
	$query = new WP_Query( $args );

	if ( empty( $query->posts ) ) {
		return new WP_Error(
			'rest_post_not_found',
			__( 'No navigation found.' ),
			array( 'status' => 404 )
		);
	}

	// Set the post ID based on the slug.
	$request['id'] = $query->posts[0]->ID;

	return $response;
}
add_filter( 'rest_request_before_callbacks', 'gutenberg_transform_slug_to_post_id', 10, 3 );

function gutenberg_update_navigation_rest_route_for_post( $route, WP_Post $post ) {

	if ( $post->post_type !== 'wp_navigation' ) {
		return $route;
	}

	$post_type_route = rest_get_route_for_post_type_items( $post->post_type );

	if ( ! $post_type_route ) {
		return '';
	}

	// Replace Post ID in route with Post "Slug" (post_name).
	return sprintf( '%s/%s', $post_type_route, $post->post_name );
}


add_filter( 'rest_route_for_post', 'gutenberg_update_navigation_rest_route_for_post', 10, 2 );