"""Content Security Policy for the main PyGoat application."""


class ContentSecurityPolicyMiddleware:
    # The portal uses local assets, Bootstrap, jQuery, Font Awesome and Google
    # Fonts. Keep executable code in external files; do not permit inline JS.
    POLICY = (
        "default-src 'self'; "
        "script-src 'self' https://use.fontawesome.com "
        "https://code.jquery.com https://cdnjs.cloudflare.com "
        "https://stackpath.bootstrapcdn.com; "
        "style-src 'self' https://stackpath.bootstrapcdn.com "
        "https://fonts.googleapis.com; "
        "font-src 'self' https://fonts.gstatic.com; "
        "img-src 'self' data:; "
        "connect-src 'self'; "
        "base-uri 'none'; "
        "object-src 'none'; "
        "frame-ancestors 'none'; "
        "form-action 'self'"
    )

    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        response = self.get_response(request)
        if response.get("Content-Type", "").lower().startswith("text/html"):
            if "Content-Security-Policy" not in response:
                response["Content-Security-Policy"] = self.POLICY
        return response
