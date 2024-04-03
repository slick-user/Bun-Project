import figlet from "figlet";

const server = Bun.serve({
    port: Bun.env.port || 3000,
    fetch(req) {
        const url = new URL(req.url);
        if (url.pathname === "/") return new Response("Home Page!");
        //if (url.pathname === "/h") return new Response(Bun.file("./test.html"));
        
        const body = figlet.textSync("Hello and Welcome to Bun! :D")
        return new Response(body);

    },
    error(error) {                                                      //Error Handler
        return new Response(`<pre>${error}\n${error.stack}</pre>`, {
            headers: {
                "Content-Type": "text/html",
            },
        });
    },

});

console.log(`Listening on LocalHost yes:${server.port}...`)