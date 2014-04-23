var FOO = "foo";
var BAR = "bar";

require( [ "blackboard" ],
    function (Blackboard) {
        describe( "Generate Blackboard Test", function () {
            it( "Is Alive!", function () {
                var blackboard = new Blackboard();

                expect(blackboard).toBeTruthy();
            });

            it( "Simple Watcher with publisher", function () {
                var blackboard = new Blackboard();

                var runs = {}
                runs[ FOO + BAR ] = false;
                runs[ FOO ] = false;
                runs[ BAR ] = false;

                blackboard.watch( [ FOO, BAR ], function (foo, bar) {
                    expect(foo).toBe(FOO);
                    expect(bar).toBe(BAR);
                    runs[ FOO + BAR ] = true;
                });

                /* When foo is available, publish bar using a publisher */
                blackboard.watch( [ FOO, blackboard.publisher( BAR ) ],
                    function (foo, resolve) {
                        resolve("bar");
                    }
                );

                blackboard.watch( FOO, function (foo) {
                    expect(foo).toBe(FOO);
                    runs[ FOO ] = true;
                });

                blackboard.watch( BAR, function (bar) {
                    expect(bar).toBe(BAR);
                    runs[ BAR ] = true;
                });

                blackboard.put( FOO, "foo" );

                expect(runs[ FOO + BAR ]).toBeTruthy();
                expect(runs[ FOO ]).toBeTruthy();
                expect(runs[ BAR ]).toBeTruthy();
            });

            it( "Work with promises", function () {
                var blackboard = new Blackboard();

                blackboard.put( FOO, "foo" );

                blackboard.promises( BAR ).watch( [ FOO ], function (foo) {
                    /* Just promise-compatible, not an actual promise... */
                    return { "then": function (cb) { cb("bar") } };
                });

                blackboard.promise( [ "bar" ] ).then(function (results) {
                    expect(results[0]).toBe(BAR);
                });
            });

            it( "Watch Published Values", function () {
                var blackboard = new Blackboard();

                var runs = {}
                runs[ FOO + BAR ] = false;
                runs[ FOO ] = false;
                runs[ BAR ] = false;

                blackboard.put( FOO, "foo" );
                blackboard.put( BAR, "bar" );

                blackboard.watch( [ FOO, BAR ], function (foo, bar) {
                    expect(foo).toBe(FOO);
                    expect(bar).toBe(BAR);
                    runs[ FOO + BAR ] = true;
                });

                blackboard.watch( FOO, function (foo) {
                    expect(foo).toBe(FOO);
                    runs[ FOO ] = true;
                });

                blackboard.watch( BAR, function (bar) {
                    expect(bar).toBe(BAR);
                    runs[ BAR ] = true;
                });

                expect(runs[ FOO + BAR ]).toBeTruthy();
                expect(runs[ FOO ]).toBeTruthy();
                expect(runs[ BAR ]).toBeTruthy();
            });

            it( "Hangup Terminates", function () {
                var blackboard = new Blackboard();

                blackboard.hangup();

                blackboard.put( FOO, "foo" );

                blackboard.watch( FOO, function (foo) {
                    expect(false).toBeTruthy();
                });
            });
        });
    }
);
