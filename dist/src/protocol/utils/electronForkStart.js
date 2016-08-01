/**
 *  @license   MIT
 *  @copyright OmniSharp Team
 *  @summary   Adds support for https://github.com/Microsoft/language-server-protocol (and more!) to https://atom.io
 */
/* tslint:disable */
var net = require('net'), fs = require('fs'), stream = require('stream'), util = require('util');
var ENABLE_LOGGING = false;
var log = (function () {
    if (!ENABLE_LOGGING) {
        return function () { };
    }
    var isFirst = true;
    var LOG_LOCATION = 'C:\\stdFork.log';
    return function log(str) {
        if (isFirst) {
            isFirst = false;
            fs.writeFileSync(LOG_LOCATION, str + '\n');
            return;
        }
        fs.appendFileSync(LOG_LOCATION, str + '\n');
    };
})();
var stdInPipeName = process.env['STDIN_PIPE_NAME'];
var stdOutPipeName = process.env['STDOUT_PIPE_NAME'];
log('STDIN_PIPE_NAME: ' + stdInPipeName);
log('STDOUT_PIPE_NAME: ' + stdOutPipeName);
log('ATOM_SHELL_INTERNAL_RUN_AS_NODE: ' + process.env['ATOM_SHELL_INTERNAL_RUN_AS_NODE']);
// stdout redirection to named pipe
(function () {
    log('Beginning stdout redirection...');
    // Create a writing stream to the stdout pipe
    var stdOutStream = net.connect(stdOutPipeName);
    // unref stdOutStream to behave like a normal standard out
    stdOutStream.unref();
    // handle process.stdout
    process.__defineGetter__('stdout', function () { return stdOutStream; });
    // handle process.stderr
    process.__defineGetter__('stderr', function () { return stdOutStream; });
    var fsWriteSyncString = function (fd, str, position, encoding) {
        //  fs.writeSync(fd, string[, position[, encoding]]);
        var buf = new Buffer(str, encoding || 'utf8');
        return fsWriteSyncBuffer(fd, buf, 0, buf.length);
    };
    var fsWriteSyncBuffer = function (fd, buffer, off, len) {
        off = Math.abs(off | 0);
        len = Math.abs(len | 0);
        //  fs.writeSync(fd, buffer, offset, length[, position]);
        var buffer_length = buffer.length;
        if (off > buffer_length) {
            throw new Error('offset out of bounds');
        }
        if (len > buffer_length) {
            throw new Error('length out of bounds');
        }
        if (((off + len) | 0) < off) {
            throw new Error('off + len overflow');
        }
        if (buffer_length - off < len) {
            // Asking for more than is left over in the buffer
            throw new Error('off + len > buffer.length');
        }
        var slicedBuffer = buffer;
        if (off !== 0 || len !== buffer_length) {
            slicedBuffer = buffer.slice(off, off + len);
        }
        stdOutStream.write(slicedBuffer);
        return slicedBuffer.length;
    };
    // handle fs.writeSync(1, ...)
    var originalWriteSync = fs.writeSync;
    fs.writeSync = function (fd, data, position, encoding) {
        if (fd !== 1) {
            return originalWriteSync.apply(fs, arguments);
        }
        // usage:
        //  fs.writeSync(fd, buffer, offset, length[, position]);
        // OR
        //  fs.writeSync(fd, string[, position[, encoding]]);
        if (data instanceof Buffer) {
            return fsWriteSyncBuffer.apply(null, arguments);
        }
        // For compatibility reasons with fs.writeSync, writing null will write "null", etc
        if (typeof data !== 'string') {
            data += '';
        }
        return fsWriteSyncString.apply(null, arguments);
    };
    log('Finished defining process.stdout, process.stderr and fs.writeSync');
})();
// stdin redirection to named pipe
(function () {
    // Begin listening to stdin pipe
    var server = net.createServer(function (stream) {
        // Stop accepting new connections, keep the existing one alive
        server.close();
        log('Parent process has connected to my stdin. All should be good now.');
        // handle process.stdin
        process.__defineGetter__('stdin', function () {
            return stream;
        });
        // Remove myself from process.argv
        process.argv.splice(1, 1);
        // Load the actual program
        var program = process.argv[1];
        log('Loading program: ' + program);
        // Unset the custom environmental variables that should not get inherited
        delete process.env['STDIN_PIPE_NAME'];
        delete process.env['STDOUT_PIPE_NAME'];
        delete process.env['ATOM_SHELL_INTERNAL_RUN_AS_NODE'];
        require(program);
        log('Finished loading program.');
        var stdinIsReferenced = true;
        var timer = setInterval(function () {
            var listenerCount = (stream.listeners('data').length +
                stream.listeners('end').length +
                stream.listeners('close').length +
                stream.listeners('error').length);
            // log('listenerCount: ' + listenerCount);
            if (listenerCount <= 1) {
                // No more "actual" listeners, only internal node
                if (stdinIsReferenced) {
                    stdinIsReferenced = false;
                    // log('unreferencing stream!!!');
                    stream.unref();
                }
            }
            else {
                // There are "actual" listeners
                if (!stdinIsReferenced) {
                    stdinIsReferenced = true;
                    stream.ref();
                }
            }
            // log(
            //     '' + stream.listeners('data').length +
            //     ' ' + stream.listeners('end').length +
            //     ' ' + stream.listeners('close').length +
            //     ' ' + stream.listeners('error').length
            // );
        }, 1000);
        timer.unref();
    });
    server.listen(stdInPipeName, function () {
        // signal via stdout that the parent process can now begin writing to stdin pipe
        process.stdout.write('ready');
    });
})();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZWxlY3Ryb25Gb3JrU3RhcnQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvcHJvdG9jb2wvdXRpbHMvZWxlY3Ryb25Gb3JrU3RhcnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7R0FJRztBQUNILG9CQUFvQjtBQUNwQixJQUFJLEdBQUcsR0FBRyxPQUFPLENBQUMsS0FBSyxDQUFDLEVBQ3BCLEVBQUUsR0FBRyxPQUFPLENBQUMsSUFBSSxDQUFDLEVBQ2xCLE1BQU0sR0FBRyxPQUFPLENBQUMsUUFBUSxDQUFDLEVBQzFCLElBQUksR0FBRyxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUM7QUFFM0IsSUFBSSxjQUFjLEdBQUcsS0FBSyxDQUFDO0FBRTNCLElBQUksR0FBRyxHQUFHLENBQUM7SUFDUCxFQUFFLENBQUMsQ0FBQyxDQUFDLGNBQWMsQ0FBQyxDQUFDLENBQUM7UUFDbEIsTUFBTSxDQUFDLGNBQVksQ0FBQyxDQUFDO0lBQ3pCLENBQUM7SUFDRCxJQUFJLE9BQU8sR0FBRyxJQUFJLENBQUM7SUFDbkIsSUFBSSxZQUFZLEdBQUcsaUJBQWlCLENBQUM7SUFDckMsTUFBTSxDQUFDLGFBQWEsR0FBUTtRQUN4QixFQUFFLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDO1lBQ1YsT0FBTyxHQUFHLEtBQUssQ0FBQztZQUNoQixFQUFFLENBQUMsYUFBYSxDQUFDLFlBQVksRUFBRSxHQUFHLEdBQUcsSUFBSSxDQUFDLENBQUM7WUFDM0MsTUFBTSxDQUFDO1FBQ1gsQ0FBQztRQUNELEVBQUUsQ0FBQyxjQUFjLENBQUMsWUFBWSxFQUFFLEdBQUcsR0FBRyxJQUFJLENBQUMsQ0FBQztJQUNoRCxDQUFDLENBQUE7QUFDTCxDQUFDLENBQUMsRUFBRSxDQUFDO0FBRUwsSUFBSSxhQUFhLEdBQUcsT0FBTyxDQUFDLEdBQUcsQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDO0FBQ25ELElBQUksY0FBYyxHQUFHLE9BQU8sQ0FB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TCxDQUFDO1lBQUMsSUFBSSxDQUFDLENBQUM7Z0JBQ0osK0JBQStCO2dCQUMvQixFQUFFLENBQUMsQ0FBQyxDQUFDLGlCQUFpQixDQUFDLENBQUMsQ0FBQztvQkFDckIsaUJBQWlCLEdBQUcsSUFBSSxDQUFDO29CQUN6QixNQUFNLENBQUMsR0FBRyxFQUFFLENBQUM7Z0JBQ2pCLENBQUM7WUFDTCxDQUFDO1lBQ0QsT0FBTztZQUNQLDZDQUE2QztZQUM3Qyw2Q0FBNkM7WUFDN0MsK0NBQStDO1lBQy9DLDZDQUE2QztZQUM3QyxLQUFLO1FBQ1QsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDO1FBQ1QsS0FBSyxDQUFDLEtBQUssRUFBRSxDQUFDO0lBQ2xCLENBQUMsQ0FBQyxDQUFDO0lBR0gsTUFBTSxDQUFDLE1BQU0sQ0FBQyxhQUFhLEVBQUU7UUFDekIsZ0ZBQWdGO1FBQ2hGLE9BQU8sQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDO0lBQ2xDLENBQUMsQ0FBQyxDQUFDO0FBRVAsQ0FBQyxDQUFDLEVBQUUsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxyXG4gKiAgQGxpY2Vuc2UgICBNSVRcclxuICogIEBjb3B5cmlnaHQgT21uaVNoYXJwIFRlYW1cclxuICogIEBzdW1tYXJ5ICAgQWRkcyBzdXBwb3J0IGZvciBodHRwczovL2dpdGh1Yi5jb20vTWljcm9zb2Z0L2xhbmd1YWdlLXNlcnZlci1wcm90b2NvbCAoYW5kIG1vcmUhKSB0byBodHRwczovL2F0b20uaW9cclxuICovXHJcbi8qIHRzbGludDpkaXNhYmxlICovXHJcbnZhciBuZXQgPSByZXF1aXJlKCduZXQnKSxcclxuICAgIGZzID0gcmVxdWlyZSgnZnMnKSxcclxuICAgIHN0cmVhbSA9IHJlcXVpcmUoJ3N0cmVhbScpLFxyXG4gICAgdXRpbCA9IHJlcXVpcmUoJ3V0aWwnKTtcclxuXHJcbnZhciBFTkFCTEVfTE9HR0lORyA9IGZhbHNlO1xyXG5cclxudmFyIGxvZyA9IChmdW5jdGlvbigpIHtcclxuICAgIGlmICghRU5BQkxFX0xPR0dJTkcpIHtcclxuICAgICAgICByZXR1cm4gZnVuY3Rpb24oKSB7fTtcclxuICAgIH1cclxuICAgIHZhciBpc0ZpcnN0ID0gdHJ1ZTtcclxuICAgIHZhciBMT0dfTE9DQVRJT04gPSAnQzpcXFxcc3RkRm9yay5sb2cnO1xyXG4gICAgcmV0dXJuIGZ1bmN0aW9uIGxvZyhzdHI6IGFueSkge1xyXG4gICAgICAgIGlmIChpc0ZpcnN0KSB7XHJcbiAgICAgICAgICAgIGlzRmlyc3QgPSBmYWxzZTtcclxuICAgICAgICAgICAgZnMud3JpdGVGaWxlU3luYyhMT0dfTE9DQVRJT04sIHN0ciArICdcXG4nKTtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuICAgICAgICBmcy5hcHBlbmRGaWxlU3luYyhMT0dfTE9DQVRJT04sIHN0ciArICdcXG4nKTtcclxuICAgIH1cclxufSkoKTtcclxuXHJcbnZhciBzdGRJblBpcGVOYW1lID0gcHJvY2Vzcy5lbnZbJ1NURElOX1BJUEVfTkFNRSddO1xyXG52YXIgc3RkT3V0UGlwZU5hbWUgPSBwcm9jZXNzLmVudlsnU1RET1VUX1BJUEVfTkFNRSddO1xyXG5cclxubG9nKCdTVERJTl9QSVBFX05BTUU6ICcgKyBzdGRJblBpcGVOYW1lKTtcclxubG9nKCdTVERPVVRfUElQRV9OQU1FOiAnICsgc3RkT3V0UGlwZU5hbWUpO1xyXG5sb2coJ0FUT01fU0hFTExfSU5URVJOQUxfUlVOX0FTX05PREU6ICcgKyBwcm9jZXNzLmVudlsnQVRPTV9TSEVMTF9JTlRFUk5BTF9SVU5fQVNfTk9ERSddKTtcclxuXHJcbi8vIHN0ZG91dCByZWRpcmVjdGlvbiB0byBuYW1lZCBwaXBlXHJcbihmdW5jdGlvbigpIHtcclxuICAgIGxvZygnQmVnaW5uaW5nIHN0ZG91dCByZWRpcmVjdGlvbi4uLicpO1xyXG5cclxuICAgIC8vIENyZWF0ZSBhIHdyaXRpbmcgc3RyZWFtIHRvIHRoZSBzdGRvdXQgcGlwZVxyXG4gICAgdmFyIHN0ZE91dFN0cmVhbSA9IG5ldC5jb25uZWN0KHN0ZE91dFBpcGVOYW1lKTtcclxuXHJcbiAgICAvLyB1bnJlZiBzdGRPdXRTdHJlYW0gdG8gYmVoYXZlIGxpa2UgYSBub3JtYWwgc3RhbmRhcmQgb3V0XHJcbiAgICBzdGRPdXRTdHJlYW0udW5yZWYoKTtcclxuXHJcbiAgICAvLyBoYW5kbGUgcHJvY2Vzcy5zdGRvdXRcclxuICAgICg8YW55PnByb2Nlc3MpLl9fZGVmaW5lR2V0dGVyX18oJ3N0ZG91dCcsIGZ1bmN0aW9uKCkgeyByZXR1cm4gc3RkT3V0U3RyZWFtOyB9KTtcclxuXHJcbiAgICAvLyBoYW5kbGUgcHJvY2Vzcy5zdGRlcnJcclxuICAgICg8YW55PnByb2Nlc3MpLl9fZGVmaW5lR2V0dGVyX18oJ3N0ZGVycicsIGZ1bmN0aW9uKCkgeyByZXR1cm4gc3RkT3V0U3RyZWFtOyB9KTtcclxuXHJcbiAgICB2YXIgZnNXcml0ZVN5bmNTdHJpbmcgPSBmdW5jdGlvbihmZDogYW55LCBzdHI6IGFueSwgcG9zaXRpb246IGFueSwgZW5jb2Rpbmc6IGFueSkge1xyXG4gICAgICAgIC8vICBmcy53cml0ZVN5bmMoZmQsIHN0cmluZ1ssIHBvc2l0aW9uWywgZW5jb2RpbmddXSk7XHJcbiAgICAgICAgdmFyIGJ1ZiA9IG5ldyBCdWZmZXIoc3RyLCBlbmNvZGluZyB8fCAndXRmOCcpO1xyXG4gICAgICAgIHJldHVybiBmc1dyaXRlU3luY0J1ZmZlcihmZCwgYnVmLCAwLCBidWYubGVuZ3RoKTtcclxuICAgIH07XHJcblxyXG4gICAgdmFyIGZzV3JpdGVTeW5jQnVmZmVyID0gZnVuY3Rpb24oZmQ6IGFueSwgYnVmZmVyOiBhbnksIG9mZjogYW55LCBsZW46IGFueSkge1xyXG4gICAgICAgIG9mZiA9IE1hdGguYWJzKG9mZiB8IDApO1xyXG4gICAgICAgIGxlbiA9IE1hdGguYWJzKGxlbiB8IDApO1xyXG5cclxuICAgICAgICAvLyAgZnMud3JpdGVTeW5jKGZkLCBidWZmZXIsIG9mZnNldCwgbGVuZ3RoWywgcG9zaXRpb25dKTtcclxuICAgICAgICB2YXIgYnVmZmVyX2xlbmd0aCA9IGJ1ZmZlci5sZW5ndGg7XHJcblxyXG4gICAgICAgIGlmIChvZmYgPiBidWZmZXJfbGVuZ3RoKSB7XHJcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignb2Zmc2V0IG91dCBvZiBib3VuZHMnKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKGxlbiA+IGJ1ZmZlcl9sZW5ndGgpIHtcclxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdsZW5ndGggb3V0IG9mIGJvdW5kcycpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoKChvZmYgKyBsZW4pIHwgMCkgPCBvZmYpIHtcclxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdvZmYgKyBsZW4gb3ZlcmZsb3cnKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKGJ1ZmZlcl9sZW5ndGggLSBvZmYgPCBsZW4pIHtcclxuICAgICAgICAgICAgLy8gQXNraW5nIGZvciBtb3JlIHRoYW4gaXMgbGVmdCBvdmVyIGluIHRoZSBidWZmZXJcclxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdvZmYgKyBsZW4gPiBidWZmZXIubGVuZ3RoJyk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB2YXIgc2xpY2VkQnVmZmVyID0gYnVmZmVyO1xyXG4gICAgICAgIGlmIChvZmYgIT09IDAgfHwgbGVuICE9PSBidWZmZXJfbGVuZ3RoKSB7XHJcbiAgICAgICAgICAgIHNsaWNlZEJ1ZmZlciA9IGJ1ZmZlci5zbGljZShvZmYsIG9mZiArIGxlbik7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBzdGRPdXRTdHJlYW0ud3JpdGUoc2xpY2VkQnVmZmVyKTtcclxuICAgICAgICByZXR1cm4gc2xpY2VkQnVmZmVyLmxlbmd0aDtcclxuICAgIH07XHJcblxyXG4gICAgLy8gaGFuZGxlIGZzLndyaXRlU3luYygxLCAuLi4pXHJcbiAgICB2YXIgb3JpZ2luYWxXcml0ZVN5bmMgPSBmcy53cml0ZVN5bmM7XHJcbiAgICBmcy53cml0ZVN5bmMgPSBmdW5jdGlvbihmZDogYW55LCBkYXRhOiBhbnksIHBvc2l0aW9uOiBhbnksIGVuY29kaW5nOiBhbnkpIHtcclxuICAgICAgICBpZiAoZmQgIT09IDEpIHtcclxuICAgICAgICAgICAgcmV0dXJuIG9yaWdpbmFsV3JpdGVTeW5jLmFwcGx5KGZzLCBhcmd1bWVudHMpO1xyXG4gICAgICAgIH1cclxuICAgICAgICAvLyB1c2FnZTpcclxuICAgICAgICAvLyAgZnMud3JpdGVTeW5jKGZkLCBidWZmZXIsIG9mZnNldCwgbGVuZ3RoWywgcG9zaXRpb25dKTtcclxuICAgICAgICAvLyBPUlxyXG4gICAgICAgIC8vICBmcy53cml0ZVN5bmMoZmQsIHN0cmluZ1ssIHBvc2l0aW9uWywgZW5jb2RpbmddXSk7XHJcblxyXG4gICAgICAgIGlmIChkYXRhIGluc3RhbmNlb2YgQnVmZmVyKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBmc1dyaXRlU3luY0J1ZmZlci5hcHBseShudWxsLCBhcmd1bWVudHMpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8gRm9yIGNvbXBhdGliaWxpdHkgcmVhc29ucyB3aXRoIGZzLndyaXRlU3luYywgd3JpdGluZyBudWxsIHdpbGwgd3JpdGUgXCJudWxsXCIsIGV0Y1xyXG4gICAgICAgIGlmICh0eXBlb2YgZGF0YSAhPT0gJ3N0cmluZycpIHtcclxuICAgICAgICAgICAgZGF0YSArPSAnJztcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiBmc1dyaXRlU3luY1N0cmluZy5hcHBseShudWxsLCBhcmd1bWVudHMpO1xyXG4gICAgfTtcclxuXHJcbiAgICBsb2coJ0ZpbmlzaGVkIGRlZmluaW5nIHByb2Nlc3Muc3Rkb3V0LCBwcm9jZXNzLnN0ZGVyciBhbmQgZnMud3JpdGVTeW5jJyk7XHJcbn0pKCk7XHJcblxyXG4vLyBzdGRpbiByZWRpcmVjdGlvbiB0byBuYW1lZCBwaXBlXHJcbihmdW5jdGlvbigpIHtcclxuXHJcbiAgICAvLyBCZWdpbiBsaXN0ZW5pbmcgdG8gc3RkaW4gcGlwZVxyXG4gICAgdmFyIHNlcnZlciA9IG5ldC5jcmVhdGVTZXJ2ZXIoZnVuY3Rpb24oc3RyZWFtOiBhbnkpIHtcclxuICAgICAgICAvLyBTdG9wIGFjY2VwdGluZyBuZXcgY29ubmVjdGlvbnMsIGtlZXAgdGhlIGV4aXN0aW5nIG9uZSBhbGl2ZVxyXG4gICAgICAgIHNlcnZlci5jbG9zZSgpO1xyXG5cclxuICAgICAgICBsb2coJ1BhcmVudCBwcm9jZXNzIGhhcyBjb25uZWN0ZWQgdG8gbXkgc3RkaW4uIEFsbCBzaG91bGQgYmUgZ29vZCBub3cuJyk7XHJcblxyXG4gICAgICAgIC8vIGhhbmRsZSBwcm9jZXNzLnN0ZGluXHJcbiAgICAgICAgKDxhbnk+cHJvY2VzcykuX19kZWZpbmVHZXR0ZXJfXygnc3RkaW4nLCBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHN0cmVhbTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgLy8gUmVtb3ZlIG15c2VsZiBmcm9tIHByb2Nlc3MuYXJndlxyXG4gICAgICAgIHByb2Nlc3MuYXJndi5zcGxpY2UoMSwgMSk7XHJcblxyXG4gICAgICAgIC8vIExvYWQgdGhlIGFjdHVhbCBwcm9ncmFtXHJcbiAgICAgICAgdmFyIHByb2dyYW0gPSBwcm9jZXNzLmFyZ3ZbMV07XHJcbiAgICAgICAgbG9nKCdMb2FkaW5nIHByb2dyYW06ICcgKyBwcm9ncmFtKTtcclxuXHJcbiAgICAgICAgLy8gVW5zZXQgdGhlIGN1c3RvbSBlbnZpcm9ubWVudGFsIHZhcmlhYmxlcyB0aGF0IHNob3VsZCBub3QgZ2V0IGluaGVyaXRlZFxyXG4gICAgICAgIGRlbGV0ZSBwcm9jZXNzLmVudlsnU1RESU5fUElQRV9OQU1FJ107XHJcbiAgICAgICAgZGVsZXRlIHByb2Nlc3MuZW52WydTVERPVVRfUElQRV9OQU1FJ107XHJcbiAgICAgICAgZGVsZXRlIHByb2Nlc3MuZW52WydBVE9NX1NIRUxMX0lOVEVSTkFMX1JVTl9BU19OT0RFJ107XHJcblxyXG4gICAgICAgIHJlcXVpcmUocHJvZ3JhbSk7XHJcblxyXG4gICAgICAgIGxvZygnRmluaXNoZWQgbG9hZGluZyBwcm9ncmFtLicpO1xyXG5cclxuICAgICAgICB2YXIgc3RkaW5Jc1JlZmVyZW5jZWQgPSB0cnVlO1xyXG4gICAgICAgIHZhciB0aW1lciA9IHNldEludGVydmFsKGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICB2YXIgbGlzdGVuZXJDb3VudCA9IChcclxuICAgICAgICAgICAgICAgIHN0cmVhbS5saXN0ZW5lcnMoJ2RhdGEnKS5sZW5ndGggK1xyXG4gICAgICAgICAgICAgICAgc3RyZWFtLmxpc3RlbmVycygnZW5kJykubGVuZ3RoICtcclxuICAgICAgICAgICAgICAgIHN0cmVhbS5saXN0ZW5lcnMoJ2Nsb3NlJykubGVuZ3RoICtcclxuICAgICAgICAgICAgICAgIHN0cmVhbS5saXN0ZW5lcnMoJ2Vycm9yJykubGVuZ3RoXHJcbiAgICAgICAgICAgICk7XHJcbiAgICAgICAgICAgIC8vIGxvZygnbGlzdGVuZXJDb3VudDogJyArIGxpc3RlbmVyQ291bnQpO1xyXG4gICAgICAgICAgICBpZiAobGlzdGVuZXJDb3VudCA8PSAxKSB7XHJcbiAgICAgICAgICAgICAgICAvLyBObyBtb3JlIFwiYWN0dWFsXCIgbGlzdGVuZXJzLCBvbmx5IGludGVybmFsIG5vZGVcclxuICAgICAgICAgICAgICAgIGlmIChzdGRpbklzUmVmZXJlbmNlZCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHN0ZGluSXNSZWZlcmVuY2VkID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gbG9nKCd1bnJlZmVyZW5jaW5nIHN0cmVhbSEhIScpO1xyXG4gICAgICAgICAgICAgICAgICAgIHN0cmVhbS51bnJlZigpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgLy8gVGhlcmUgYXJlIFwiYWN0dWFsXCIgbGlzdGVuZXJzXHJcbiAgICAgICAgICAgICAgICBpZiAoIXN0ZGluSXNSZWZlcmVuY2VkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgc3RkaW5Jc1JlZmVyZW5jZWQgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgICAgIHN0cmVhbS5yZWYoKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAvLyBsb2coXHJcbiAgICAgICAgICAgIC8vICAgICAnJyArIHN0cmVhbS5saXN0ZW5lcnMoJ2RhdGEnKS5sZW5ndGggK1xyXG4gICAgICAgICAgICAvLyAgICAgJyAnICsgc3RyZWFtLmxpc3RlbmVycygnZW5kJykubGVuZ3RoICtcclxuICAgICAgICAgICAgLy8gICAgICcgJyArIHN0cmVhbS5saXN0ZW5lcnMoJ2Nsb3NlJykubGVuZ3RoICtcclxuICAgICAgICAgICAgLy8gICAgICcgJyArIHN0cmVhbS5saXN0ZW5lcnMoJ2Vycm9yJykubGVuZ3RoXHJcbiAgICAgICAgICAgIC8vICk7XHJcbiAgICAgICAgfSwgMTAwMCk7XHJcbiAgICAgICAgdGltZXIudW5yZWYoKTtcclxuICAgIH0pO1xyXG5cclxuXHJcbiAgICBzZXJ2ZXIubGlzdGVuKHN0ZEluUGlwZU5hbWUsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIC8vIHNpZ25hbCB2aWEgc3Rkb3V0IHRoYXQgdGhlIHBhcmVudCBwcm9jZXNzIGNhbiBub3cgYmVnaW4gd3JpdGluZyB0byBzdGRpbiBwaXBlXHJcbiAgICAgICAgcHJvY2Vzcy5zdGRvdXQud3JpdGUoJ3JlYWR5Jyk7XHJcbiAgICB9KTtcclxuXHJcbn0pKCk7XHJcbiJdfQ==