export async function DELETE(req: Request,) {
	const { searchParams } = new URL(req.url);
	const id = searchParams.get('id');
	
	if (!id) {
		return new Response('ID is required', { status: 400 });
	}

	return new Response(`Submission with ID ${id} deleted successfully`, { status: 200 });
}